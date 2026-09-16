// Site checks against a running build (npm run build && npm start).
//   BASE_URL=http://localhost:3000 npm run check:site
// 1. Every route exists in both languages, returns 200, has the right <html lang> and hreflang alternates.
// 2. Full internal link crawl from / and /fr: every link returns 200, every #anchor exists on its page.
// 3. No link anywhere points at a nav item hidden by a visibility flag; the hidden route itself stays live.
// 4. EN/FR structural parity of <main> on every route.
// 5. Favicon, apple icon and Open Graph image are referenced in the HTML and served correctly.
// 6. Retired URLs answer 301 to their replacement; nothing links to or routes through "houses".
// 7. SHOW_IMMOBILIER false: no page says "Immobilier". True: the homepage and About page present
//    Balzac Immobilier in both languages. Either way, no page carries property listing vocabulary
//    (prices, listings, for sale or rent, surfaces): Immobilier is described as an activity only.
// 8. /robots.txt allows crawling and points at /sitemap.xml; the sitemap lists every live route in
//    both languages with hreflang alternates, and nothing hidden by a flag.
// 9. No email address anywhere in what the site ships: every page's full HTML (including the inline
//    React payload), the 404 page, and every script and stylesheet those pages load.
// 10. No placeholder anywhere: no "To be confirmed", "À compléter", "à confirmer" and no data-pending marker.
// Reports (without failing) which temporary mockup crops are still in use.
import { BASE_URL, flags, hiddenSlugs, routePairs } from "./lib/site.mjs";

const failures = [];
const fail = (msg) => failures.push(msg);
const cache = new Map();

async function get(path) {
  if (!cache.has(path)) {
    const res = await fetch(BASE_URL + path, { redirect: "manual" });
    const type = res.headers.get("content-type") || "";
    const body = type.includes("text/html") ? await res.text() : Buffer.from(await res.arrayBuffer());
    cache.set(path, { status: res.status, type, body });
  }
  return cache.get(path);
}

const mainOf = (html) => (html.match(/<main[\s\S]*?<\/main>/) || [""])[0];
const hrefs = (html) => [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));
const stripFr = (href) => href.replace(/^\/fr(?=\/|$|#)/, "") || "/";

function outline(html) {
  const main = mainOf(html);
  const count = (re) => (main.match(re) || []).length;
  return {
    sections: count(/<section\b/g),
    h1: count(/<h1\b/g),
    h2: count(/<h2\b/g),
    h3: count(/<h3\b/g),
    p: count(/<p\b/g),
    li: count(/<li\b/g),
    dl: count(/<dl\b/g),
    img: count(/<img\b/g),
    links: hrefs(main).map(stripFr),
  };
}

const pairs = routePairs();
const hidden = hiddenSlugs();

// 1 + 4
for (const pair of pairs) {
  if (!pair.inEn || !pair.inFr) fail(`route ${pair.slug || "/"} missing its ${pair.inEn ? "FR" : "EN"} twin`);
  const pages = {};
  for (const [locale, path] of [
    ["en", pair.en],
    ["fr", pair.fr],
  ]) {
    const res = await get(path);
    if (res.status !== 200) {
      fail(`${path} returned ${res.status}`);
      continue;
    }
    const lang = (res.body.match(/<html[^>]*\blang="([^"]+)"/) || [])[1];
    if (lang !== locale) fail(`${path} has lang="${lang}", expected "${locale}"`);
    for (const alt of ["en", "fr", "x-default"]) {
      if (!new RegExp(`<link[^>]*rel="alternate"[^>]*hrefLang="${alt}"`).test(res.body)) fail(`${path} missing hreflang ${alt}`);
    }
    pages[locale] = outline(res.body);
  }
  if (pages.en && pages.fr && JSON.stringify(pages.en) !== JSON.stringify(pages.fr)) {
    fail(`parity ${pair.en} vs ${pair.fr}\n    en ${JSON.stringify(pages.en)}\n    fr ${JSON.stringify(pages.fr)}`);
  }
}

// 2 + 3
const seen = new Set();
const queue = ["/", "/fr"];
const anchors = [];
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await get(path);
  if (res.status !== 200) {
    fail(`crawl ${path} returned ${res.status}`);
    continue;
  }
  if (!res.type.includes("text/html")) continue;
  for (const href of hrefs(res.body)) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const [target, hash] = href.split("#");
    const clean = target || path;
    const slug = stripFr(clean).replace(/^\//, "");
    if (hidden.includes(slug)) fail(`${path} links to hidden item ${href}`);
    if (hash) anchors.push({ from: path, page: clean, hash });
    if (!seen.has(clean)) queue.push(clean);
  }
}
for (const { from, page, hash } of anchors) {
  const res = await get(page);
  if (typeof res.body === "string" && !res.body.includes(`id="${hash}"`)) fail(`${from} links to ${page}#${hash} but that id does not exist`);
}
for (const slug of hidden) {
  for (const path of [`/${slug}`, `/fr/${slug}`]) {
    const res = await get(path);
    if (res.status !== 200) fail(`hidden route ${path} should stay live, got ${res.status}`);
  }
}

// 5
const pngSize = (buf) => (buf.length > 24 && buf.toString("ascii", 12, 16) === "IHDR" ? [buf.readUInt32BE(16), buf.readUInt32BE(20)] : null);
const checkedAssets = new Set();
const expectAsset = async (page, label, url, type, size) => {
  if (!url) return fail(`${page} has no ${label} in the HTML`);
  const target = new URL(url, BASE_URL);
  const key = target.pathname + target.search;
  if (checkedAssets.has(key)) return;
  checkedAssets.add(key);
  const res = await get(key);
  if (res.status !== 200) return fail(`${label} ${url} returned ${res.status}`);
  if (!res.type.includes(type)) fail(`${label} ${url} served as ${res.type}, expected ${type}`);
  if (size) {
    const dims = pngSize(res.body);
    if (!dims || dims[0] !== size[0] || dims[1] !== size[1]) fail(`${label} ${url} is ${dims}, expected ${size}`);
  }
};
const metaAll = (html, attr, name) =>
  [...html.matchAll(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]+)"`, "g"))].map((m) => m[1]);
for (const pair of pairs) {
  for (const [locale, path] of [
    ["en", pair.en],
    ["fr", pair.fr],
  ]) {
    const html = (await get(path)).body;
    if (typeof html !== "string") continue;
    const icons = [...html.matchAll(/<link[^>]*rel="icon"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
    await expectAsset(path, "icon.svg", icons.find((h) => h.includes("icon.svg")), "image/svg+xml");
    await expectAsset(path, "favicon.ico", icons.find((h) => h.includes("favicon.ico")), "image/");
    await expectAsset(path, "apple-touch-icon", (html.match(/<link[^>]*rel="apple-touch-icon"[^>]*href="([^"]+)"/) || [])[1], "image/png", [180, 180]);

    const og = metaAll(html, "property", "og:image");
    const tw = metaAll(html, "name", "twitter:image");
    if (og.length !== 1) fail(`${path} has ${og.length} og:image tags, expected 1`);
    if (tw.length !== 1) fail(`${path} has ${tw.length} twitter:image tags, expected 1`);
    if (!metaAll(html, "property", "og:image:alt").length) fail(`${path} has no og:image:alt`);
    for (const [label, url] of [
      ["og:image", og[0]],
      ["twitter:image", tw[0]],
    ]) {
      const isFrCard = Boolean(url) && new URL(url).pathname.startsWith("/fr/");
      if (url && isFrCard !== (locale === "fr")) fail(`${path} ${label} ${url} is not the ${locale.toUpperCase()} card`);
      await expectAsset(path, label, url, "image/png", [1200, 630]);
    }
  }
}

// 6
const REDIRECTS = [
  ["/houses", "/about"],
  ["/fr/houses", "/fr/about"],
];
for (const [from, to] of REDIRECTS) {
  const res = await fetch(BASE_URL + from, { redirect: "manual" });
  const location = res.headers.get("location") || "";
  const target = location ? new URL(location, BASE_URL).pathname : "";
  if (res.status !== 301 || target !== to) fail(`${from} should 301 to ${to}, got ${res.status} ${location}`);
  const landed = await fetch(BASE_URL + from);
  if (!landed.ok) fail(`${from} does not land on a live page (${landed.status})`);
}
if (pairs.some((pair) => pair.slug.includes("houses"))) fail("a route is still named houses");
for (const path of seen) {
  const res = cache.get(path);
  if (typeof res?.body === "string" && hrefs(res.body).some((href) => href.includes("/houses"))) fail(`${path} still links to /houses`);
}

// 7
const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ");
const flagState = flags();
const LISTING_WORDS = /(\d\s?(€|EUR|CHF|m²|m2)(?![\p{L}\d])|(?<!\p{L})(prix|price|annonces?|listings?|à vendre|for sale|à louer|for rent|bedrooms?|chambres?|surface habitable)(?!\p{L}))/iu;
for (const pair of pairs) {
  for (const path of [pair.en, pair.fr]) {
    const res = await get(path);
    if (typeof res.body !== "string") continue;
    const text = visibleText(res.body);
    if (!flagState.immobilier && /immobili/i.test(text)) fail(`${path} mentions Immobilier while SHOW_IMMOBILIER is false`);
    const listing = text.match(LISTING_WORDS);
    if (listing) fail(`${path} carries property listing vocabulary ("${listing[0]}")`);
  }
}
if (flagState.immobilier) {
  for (const path of ["/", "/fr", "/about", "/fr/about"]) {
    const res = await get(path);
    if (typeof res.body !== "string") continue;
    if (!/Balzac Immobilier/.test(visibleText(res.body))) fail(`${path} does not present Balzac Immobilier while SHOW_IMMOBILIER is true`);
    if (!res.body.includes('id="immobilier"')) fail(`${path} has no #immobilier section while SHOW_IMMOBILIER is true`);
  }
}

// 8
const SITE = "https://balzacgroupe.com";
const robots = await fetch(`${BASE_URL}/robots.txt`);
const robotsText = robots.ok ? await robots.text() : "";
if (!robots.ok) fail(`/robots.txt returned ${robots.status}`);
if (!/User-Agent:\s*\*/i.test(robotsText) || !/Allow:\s*\//i.test(robotsText)) fail("/robots.txt does not allow all user agents");
if (!robotsText.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail("/robots.txt does not point at the sitemap");

const sitemap = await fetch(`${BASE_URL}/sitemap.xml`);
const sitemapXml = sitemap.ok ? await sitemap.text() : "";
if (!sitemap.ok) fail(`/sitemap.xml returned ${sitemap.status}`);
const entries = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const listed = entries.map((e) => (e.match(/<loc>([^<]+)<\/loc>/) || [])[1]).filter(Boolean);
const expected = pairs
  .filter((pair) => !hidden.includes(pair.slug))
  .flatMap((pair) => [pair.en, pair.fr])
  .map((path) => `${SITE}${path === "/" ? "/" : path}`);
for (const url of expected) if (!listed.includes(url)) fail(`sitemap is missing ${url}`);
for (const url of listed) if (!expected.includes(url)) fail(`sitemap lists ${url}, which is not a live route`);
for (const entry of entries) {
  const loc = (entry.match(/<loc>([^<]+)<\/loc>/) || [])[1];
  for (const lang of ["en", "fr", "x-default"]) {
    if (!new RegExp(`hreflang="${lang}"`).test(entry)) fail(`sitemap entry ${loc} has no ${lang} alternate`);
  }
}

// 9 + 10
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9-]+(\.[A-Z0-9-]+)*\.[A-Z]{2,}/gi;
// File names such as logo@2x.png look like addresses; they are not.
const notFile = (match) => !/\.(png|jpe?g|webp|avif|gif|svg|ico|js|css|woff2?)$/i.test(match);
const PLACEHOLDER = /to be confirmed|À compléter|à confirmer|data-pending/i;
const shipped = new Set();
const notFound = await fetch(`${BASE_URL}/this-page-does-not-exist-${Date.now()}`);
const notFoundHtml = await notFound.text();
const shippedPages = [...[...seen].map((path) => [path, cache.get(path)?.body]), ["404 page", notFoundHtml]];
let emailScans = 0;
for (const [path, html] of shippedPages) {
  if (typeof html !== "string") continue;
  emailScans += 1;
  const found = (html.match(EMAIL) || []).filter(notFile);
  if (found.length) fail(`${path} ships an email address: ${[...new Set(found)].join(", ")}`);
  if (PLACEHOLDER.test(html)) fail(`${path} ships a placeholder ("${html.match(PLACEHOLDER)[0]}")`);
  for (const m of html.matchAll(/<(?:script|link)[^>]+(?:src|href)="(\/_next\/static\/[^"]+\.(?:js|css))"/g)) shipped.add(m[1]);
}
for (const asset of shipped) {
  const res = await fetch(BASE_URL + asset);
  const body = await res.text();
  emailScans += 1;
  const found = (body.match(EMAIL) || []).filter(notFile);
  if (found.length) fail(`${asset} ships an email address: ${[...new Set(found)].join(", ")}`);
  if (/to be confirmed|À compléter|à confirmer/i.test(body)) fail(`${asset} ships a placeholder`);
}

const tempInUse = new Set();
for (const pair of pairs) {
  for (const path of [pair.en, pair.fr]) {
    const res = await get(path);
    if (typeof res.body === "string") for (const m of res.body.matchAll(/temp-[a-z-]+\.jpg/g)) tempInUse.add(m[0]);
  }
}

if (failures.length) {
  console.error(`check:site FAILED (${failures.length})\n${failures.map((f) => `  ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `check:site ok · ${pairs.length} routes x 2 languages · ${seen.size} crawled pages, ${anchors.length} anchors · hidden: ${hidden.join(", ") || "none"} · parity ok · icons + OG ok · redirects 301 ok · immobilier ${flagState.immobilier ? "shown EN + FR, no listings" : "hidden everywhere"} · sitemap ${listed.length} urls + robots ok · no email address or placeholder in ${emailScans} shipped files`,
);
console.log(`temporary crops still in use: ${[...tempInUse].sort().join(", ") || "none"}`);
