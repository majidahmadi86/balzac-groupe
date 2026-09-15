// Site checks against a running build (npm run build && npm start).
//   BASE_URL=http://localhost:3000 npm run check:site
// 1. Every route exists in both languages, returns 200, has the right <html lang> and hreflang alternates.
// 2. Full internal link crawl from / and /fr: every link returns 200, every #anchor exists on its page.
// 3. No link anywhere points at a nav item hidden by a visibility flag; the hidden route itself stays live.
// 4. EN/FR structural parity of <main> on every route.
// 5. Favicon, apple icon and Open Graph image are referenced in the HTML and served correctly.
// 6. Retired URLs answer 301 to their replacement; nothing links to or routes through "houses".
// 7. While SHOW_IMMOBILIER is false, no page says "Immobilier" anywhere in its rendered text.
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
if (!flagState.immobilier) {
  for (const pair of pairs) {
    for (const path of [pair.en, pair.fr]) {
      const res = await get(path);
      if (typeof res.body === "string" && /immobili/i.test(visibleText(res.body))) fail(`${path} mentions Immobilier while SHOW_IMMOBILIER is false`);
    }
  }
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
  `check:site ok · ${pairs.length} routes x 2 languages · ${seen.size} crawled pages, ${anchors.length} anchors · hidden: ${hidden.join(", ") || "none"} · parity ok · icons + OG ok · redirects 301 ok · immobilier ${flagState.immobilier ? "shown" : "hidden everywhere"}`,
);
console.log(`temporary crops still in use: ${[...tempInUse].sort().join(", ") || "none"}`);
