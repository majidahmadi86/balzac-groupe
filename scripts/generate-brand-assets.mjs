// Generates the favicon and Open Graph set from the plaque design.
//   node scripts/generate-brand-assets.mjs
// Outputs (committed):
//   app/icon.svg, app/apple-icon.png (180), app/favicon.ico (16 + 32),
//   app/opengraph-image.png and app/twitter-image.png (+ .alt.txt) for EN, the same under app/fr for FR.
// Geometry mirrors components/Plaque.tsx; motto and tagline are read from lib/i18n.ts.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { openBrowser } from "./lib/browser.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const NAVY = "#001824";
const GOLD = "#b09a6a";
const CREAM = "#f4f0e9";
const CREAM_50 = "#faf8f4";

// EB Garamond SemiBold "B" outline (units per em 1000, y up), extracted with fontTools
// from app/fonts/eb-garamond-latin-wght-normal.woff2 at wght 600. Bounds x 17..580, y -5..657.
const B_PATH =
  "M41-5Q30-5 24-1Q17 3 17 9Q17 22 43 28Q78 37 95 50Q111 64 111 97V550Q111 584 98 599Q84 614 48 620Q34 622 28 628Q22 634 22 640Q22 647 28 650Q35 654 46 654Q76 654 95 653Q114 652 131 651Q148 649 171 649Q193 649 210 651Q228 653 249 655Q270 657 303 657Q421 657 481 624Q542 590 542 508Q542 476 529 449Q515 422 497 407Q481 392 465 383Q449 374 426 367Q422 366 422 362Q422 358 426 357Q451 351 478 341Q504 331 528 313Q551 295 566 266Q580 238 580 194Q580 138 562 106Q545 73 520 56Q496 39 475 28Q443 12 401 4Q360-4 302-4Q275-4 244-2Q213 0 179 0Q156 0 133-1Q111-2 88-4Q65-5 41-5ZM307 46Q342 46 372 65Q402 84 420 116Q438 148 438 187Q438 224 428 247Q418 271 405 285Q391 300 380 307Q370 314 348 322Q325 330 290 330Q268 330 254 320Q240 310 240 297V112Q240 77 257 62Q275 46 307 46ZM282 369Q307 369 331 375Q355 381 379 397Q388 404 401 426Q415 448 415 490Q415 527 404 556Q394 585 368 601Q343 618 298 618Q265 618 253 607Q240 596 240 574V405Q240 384 255 376Q270 369 282 369Z";

function notchedFrame(x, y, w, h, r) {
  return [
    `M${x + r},${y}`,
    `H${x + w - r}`,
    `A${r},${r} 0 0 0 ${x + w},${y + r}`,
    `V${y + h - r}`,
    `A${r},${r} 0 0 0 ${x + w - r},${y + h}`,
    `H${x + r}`,
    `A${r},${r} 0 0 0 ${x},${y + h - r}`,
    `V${y + r}`,
    `A${r},${r} 0 0 0 ${x + r},${y}`,
    "Z",
  ].join(" ");
}

const glyph = (height) => {
  const s = height / 662;
  return `<path d="${B_PATH}" fill="${CREAM_50}" transform="translate(${(16 - 298.5 * s).toFixed(3)} ${(16 + 326 * s).toFixed(3)}) scale(${s.toFixed(5)} ${(-s).toFixed(5)})"/>`;
};

/**
 * Favicon on a 32-unit grid that lands on whole pixels at 16px:
 * 1px gold border, 1px navy gap, 1px gold rule, then a single B.
 * The plaque's corner notches are dropped here; they only read on the apple icon.
 */
function faviconSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  <rect width="32" height="32" rx="2" fill="${NAVY}"/>
  <rect x="1" y="1" width="30" height="30" rx="1.5" fill="none" stroke="${GOLD}" stroke-width="2"/>
  <rect x="5" y="5" width="22" height="22" fill="none" stroke="${GOLD}" stroke-width="1.6" stroke-opacity="0.85"/>
  ${glyph(17)}
</svg>`;
}

/** Apple touch icon: full-bleed square (iOS rounds it), finer double border with the plaque's notched corners. */
function appleIconSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  <rect width="32" height="32" fill="${NAVY}"/>
  <rect x="2.75" y="2.75" width="26.5" height="26.5" fill="none" stroke="${GOLD}" stroke-width="1.5"/>
  <path d="${notchedFrame(5.5, 5.5, 21, 21, 1.8)}" fill="none" stroke="${GOLD}" stroke-width="0.9"/>
  ${glyph(15.2)}
</svg>`;
}

/** Full plaque lockup (components/Plaque.tsx geometry), text set in the embedded EB Garamond. */
function plaqueSvg(width) {
  const w = 300;
  const h = 104;
  const i = 7;
  const r = 5;
  const corners = [
    [i, i],
    [w - i, i],
    [w - i, h - i],
    [i, h - i],
  ]
    .map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.6" fill="none" stroke="${GOLD}" stroke-width="0.8"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${width}">
  <rect width="${w}" height="${h}" fill="${NAVY}"/>
  <rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="none" stroke="${GOLD}" stroke-width="1.6"/>
  <path d="${notchedFrame(i, i, w - 2 * i, h - 2 * i, r)}" fill="none" stroke="${GOLD}" stroke-width="0.9"/>
  ${corners}
  <g text-anchor="middle" fill="${CREAM_50}" font-family="EBG">
    <text x="150" y="29" font-size="12.5" letter-spacing="3.8" font-weight="500">GROUPE</text>
    <text x="150" y="72" font-size="57" font-weight="600">Balzac</text>
    <text x="150" y="88.5" font-size="7.8" font-weight="500" textLength="236" lengthAdjust="spacing">CULTURE · PATRIMOINE · ART DE VIVRE</text>
  </g>
</svg>`;
}

function readCopy() {
  const source = readFileSync(join(root, "lib/i18n.ts"), "utf8");
  const pick = (key) => [...source.matchAll(new RegExp(`^  ${key}: "([^"]+)",`, "gm"))].map((m) => m[1]);
  const [frMotto, enMotto] = pick("motto");
  const [frTagline, enTagline] = pick("tagline");
  if (!frMotto || !enMotto || !frTagline || !enTagline) throw new Error("Could not read motto/tagline from lib/i18n.ts");
  return { fr: { motto: frMotto, tagline: frTagline }, en: { motto: enMotto, tagline: enTagline } };
}

function ogHtml({ motto, tagline }, fontData) {
  return `<!doctype html><html><head><style>
  @font-face { font-family: EBG; src: url(data:font/woff2;base64,${fontData}) format("woff2"); font-weight: 400 800; }
  html, body { margin: 0; }
  body { width: 1200px; height: 630px; background: ${CREAM}; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: EBG, Georgia, serif; color: ${NAVY}; }
  .frame { position: absolute; inset: 28px; border: 1px solid rgba(176,154,106,0.55); }
  h1 { margin: 44px 0 0; font-size: 66px; font-weight: 600; line-height: 1; letter-spacing: -0.005em; }
  .rule { width: 64px; height: 1px; background: ${GOLD}; margin: 30px 0 0; }
  .tagline { margin: 26px 0 0; font-size: 17px; font-weight: 500; letter-spacing: 0.32em; text-transform: uppercase; color: rgba(0,24,36,0.8); }
  </style></head><body>
  <div class="frame"></div>
  ${plaqueSvg(470)}
  <h1>${motto}</h1>
  <div class="rule"></div>
  <div class="tagline">${tagline}</div>
  </body></html>`;
}

function icoFromPngs(pngs) {
  // ICO container with PNG-compressed entries (supported by all current browsers).
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const { browser, close } = await openBrowser();
try {
  const page = await browser.newPage();

  const rasterize = async (svg, size) => {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`);
    return Buffer.from(await page.screenshot({ type: "png", omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } }));
  };

  writeFileSync(join(root, "app/icon.svg"), faviconSvg(32) + "\n");
  writeFileSync(join(root, "app/apple-icon.png"), await rasterize(appleIconSvg(180), 180));
  const ico = icoFromPngs([
    { size: 16, data: await rasterize(faviconSvg(16), 16) },
    { size: 32, data: await rasterize(faviconSvg(32), 32) },
  ]);
  writeFileSync(join(root, "app/favicon.ico"), ico);

  const copy = readCopy();
  const fontData = readFileSync(join(root, "app/fonts/eb-garamond-latin-wght-normal.woff2")).toString("base64");
  for (const [locale, dir] of [
    ["en", "app"],
    ["fr", "app/fr"],
  ]) {
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.setContent(ogHtml(copy[locale], fontData), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const og = Buffer.from(await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } }));
    const alt = `Groupe Balzac · ${copy[locale].motto}`;
    // Same card for Open Graph and X/Twitter.
    for (const name of ["opengraph-image", "twitter-image"]) {
      writeFileSync(join(root, dir, `${name}.png`), og);
      writeFileSync(join(root, dir, `${name}.alt.txt`), alt);
    }
  }

  await page.close();
  console.log("brand assets written: icon.svg, apple-icon.png, favicon.ico, opengraph-image and twitter-image (EN + FR)");
} finally {
  await close();
}
