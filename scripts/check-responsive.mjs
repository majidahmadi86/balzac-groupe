// Responsive gate against a running build, every route in both languages, 320 to 1920px.
//   BASE_URL=http://localhost:3000 npm run check:responsive
// Fails the run on any of:
//   overflow  horizontal overflow of the page
//   overlap   text escaping its section into an adjacent one
//   clipped   a section shorter than its content
//   tap       an interactive target under 44x44px (links inside running text are exempt, per WCAG)
//   aspect    below 768px, an image whose box aspect is more than 25% off its source
//             (hero images marked data-crop="art-directed" are exempt)
// Runs with prefers-reduced-motion so entrance transforms never skew measurements.
// Uses a local Chrome/Edge (or BROWSER_PATH), or attaches to CDP_URL.
import { foregroundPage, openBrowser } from "./lib/browser.mjs";
import { BASE_URL, routePairs } from "./lib/site.mjs";

const WIDTHS = [320, 360, 375, 390, 414, 600, 768, 820, 1024, 1280, 1440, 1920];
const CHECKS = ["overflow", "overlap", "clipped", "tap", "aspect"];
const pages = routePairs().flatMap((pair) => [
  { path: pair.en, lang: "en", slug: pair.slug || "home" },
  { path: pair.fr, lang: "fr", slug: pair.slug || "home" },
]);

function audit() {
  const doc = document.documentElement;
  const vw = doc.clientWidth;
  const out = { overflow: [], overlap: [], clipped: [], tap: [], aspect: [] };
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const label = el.getAttribute("aria-labelledby") ? `[${el.getAttribute("aria-labelledby")}]` : "";
    const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 32);
    return `${el.tagName.toLowerCase()}${id}${label}${text ? ` "${text}"` : ""}`;
  };
  const shown = (el) => {
    if (el.closest('[aria-hidden="true"]')) return false;
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    }
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) return false;
    // Visually hidden until focused (skip links, sr-only): not a tap target.
    const own = getComputedStyle(el);
    return !(own.clip && own.clip !== "auto") && own.clipPath === "none";
  };

  if (doc.scrollWidth > vw) out.overflow.push(`page is ${doc.scrollWidth}px wide in ${vw}px`);

  const blocks = [...document.querySelectorAll("body > header, main section, body > footer")].filter(shown);
  for (const block of blocks) {
    const box = block.getBoundingClientRect();
    if (block.scrollHeight > block.clientHeight + 2) {
      out.clipped.push(`${describe(block)} content ${block.scrollHeight}px > box ${block.clientHeight}px`);
    }
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.textContent.trim() && n.parentElement && shown(n.parentElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      // Text owned by a nested section is judged against that section instead.
      if (node.parentElement.closest("section, header, footer") !== block) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width < 1 || rect.height < 1) continue;
        if (rect.top < box.top - 1 || rect.bottom > box.bottom + 1) {
          out.overlap.push(`"${node.textContent.trim().slice(0, 30)}" escapes ${describe(block).split(" ")[0]} by ${Math.round(Math.max(box.top - rect.top, rect.bottom - box.bottom))}px`);
          break;
        }
      }
    }
  }

  const interactive = document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], summary');
  for (const el of interactive) {
    if (!shown(el)) continue;
    if (el.tagName === "A") {
      // WCAG inline exception: a link set inside a sentence (a text element with other words around it).
      let parent = el.parentElement;
      while (parent && getComputedStyle(parent).display.startsWith("inline")) parent = parent.parentElement;
      const own = (el.textContent || "").trim();
      const around = (parent?.textContent || "").trim();
      const textElement = parent && ["P", "DD", "TD", "FIGCAPTION", "BLOCKQUOTE"].includes(parent.tagName);
      if (textElement && getComputedStyle(el).display.startsWith("inline") && !getComputedStyle(el).display.includes("flex") && around.length > own.length + 3) continue;
    }
    const r = el.getBoundingClientRect();
    if (r.width < 43.5 || r.height < 43.5) out.tap.push(`${describe(el)} is ${Math.round(r.width)}x${Math.round(r.height)}`);
  }

  if (window.innerWidth < 768) {
    for (const img of document.querySelectorAll("main img")) {
      if (!shown(img) || img.closest('[data-crop="art-directed"]') || img.dataset.crop === "art-directed") continue;
      if (!img.naturalWidth || !img.naturalHeight) {
        out.aspect.push(`${img.getAttribute("src")?.slice(0, 60)} not loaded`);
        continue;
      }
      const r = img.getBoundingClientRect();
      const natural = img.naturalWidth / img.naturalHeight;
      const boxRatio = r.width / r.height;
      const off = Math.abs(boxRatio / natural - 1);
      const fit = getComputedStyle(img).objectFit;
      if ((fit === "fill" && off > 0.02) || off > 0.25) {
        out.aspect.push(`${decodeURIComponent(img.currentSrc.split("url=")[1]?.split("&")[0] || img.src).slice(0, 50)} box ${boxRatio.toFixed(2)} vs source ${natural.toFixed(2)} (${fit})`);
      }
    }
  }
  return out;
}

const { browser, close } = await openBrowser();
const table = [];
const details = [];
try {
  const page = await foregroundPage(browser);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  for (const target of pages) {
    const row = { page: `${target.path}`, lang: target.lang, counts: Object.fromEntries(CHECKS.map((c) => [c, 0])) };
    await page.setViewport({ width: WIDTHS[0], height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE_URL + target.path, { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((img) => {
          img.loading = "eager";
          const settle = new Promise((r) => setTimeout(r, 4000));
          return Promise.race([img.decode().catch(() => {}), settle]);
        }),
      );
    });
    for (const width of WIDTHS) {
      await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      await new Promise((r) => setTimeout(r, 120));
      const found = await page.evaluate(audit);
      for (const check of CHECKS) {
        if (found[check].length) {
          row.counts[check] += 1;
          for (const msg of found[check]) details.push(`${check.padEnd(8)} ${target.path} @${width}px  ${msg}`);
        }
      }
    }
    table.push(row);
  }
} finally {
  await close();
}

const cell = (n) => (n === 0 ? "pass" : `FAIL ${n}/${WIDTHS.length}`);
const header = `| page | ${CHECKS.join(" | ")} |`;
const rule = `|${" --- |".repeat(CHECKS.length + 1)}`;
const lines = table.map((row) => `| ${row.page} | ${CHECKS.map((c) => cell(row.counts[c])).join(" | ")} |`);
console.log(`Responsive gate · ${pages.length} pages x ${WIDTHS.length} widths (${WIDTHS.join(", ")})\n`);
console.log([header, rule, ...lines].join("\n"));

const failed = table.some((row) => CHECKS.some((c) => row.counts[c] > 0));
if (failed) {
  const unique = [...new Set(details)];
  const limit = Number(process.env.GATE_DETAIL_LIMIT) || 80;
  console.error(`\ncheck:responsive FAILED\n${unique.slice(0, limit).join("\n")}${unique.length > limit ? `\n... ${unique.length - limit} more (GATE_DETAIL_LIMIT raises this)` : ""}`);
  process.exit(1);
}
console.log("\ncheck:responsive ok");
