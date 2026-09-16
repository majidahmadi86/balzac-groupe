// Measured contrast, baked-in sign text and form reach, for the responsive gate.
//
// Contrast: every text run, input value and placeholder inside a [data-contrast] region is measured
// against what is actually rendered behind it. The text is made transparent, the page is screenshotted,
// and each glyph box is sampled pixel by pixel; the ratio at the 5th percentile of the worst pixels must
// reach 4.5:1 (so photos and gradients are judged by their brightest spots, not an average).

export const CONTRAST_MIN = 4.5;

/** Browser side: text boxes and colours of everything inside [data-contrast] regions, in document coordinates. */
function collectTargets() {
  const parse = (value) => {
    const m = value.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
  };
  const visible = (el) => {
    if (el.closest('[aria-hidden="true"]')) return false;
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
      if (cs.clip && cs.clip !== "auto") return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const targets = [];
  for (const region of document.querySelectorAll("[data-contrast]")) {
    if (!visible(region)) continue;
    const walker = document.createTreeWalker(region, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent.trim();
      const parent = node.parentElement;
      if (!text || !parent || !visible(parent)) continue;
      if (parent.closest("input, textarea, select, option")) continue;
      const color = parse(getComputedStyle(parent).color);
      if (!color) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (r.width < 3 || r.height < 6) continue;
        targets.push({ kind: "text", label: text.slice(0, 40), color, x: r.left, y: r.top + scrollY, w: r.width, h: r.height });
      }
    }
    for (const field of region.querySelectorAll("input:not([type=hidden]), textarea")) {
      if (!visible(field)) continue;
      const r = field.getBoundingClientRect();
      const cs = getComputedStyle(field);
      const inset = Math.max(4, parseFloat(cs.paddingLeft) || 0);
      const box = { x: r.left + inset, y: r.top + scrollY + 6, w: Math.min(160, r.width - inset * 2), h: Math.min(22, r.height - 12) };
      const label = field.labels?.[0]?.textContent.trim() || field.name;
      targets.push({ kind: "input", label: `${label} (value)`, color: parse(cs.color), ...box });
      const placeholder = parse(getComputedStyle(field, "::placeholder").color);
      if (field.placeholder && placeholder) targets.push({ kind: "placeholder", label: `${label} (placeholder)`, color: placeholder, ...box });
    }
  }
  return targets;
}

/** Browser side: sample a screenshot (base64 PNG of the clip) for each target box. */
async function sampleTargets(b64, clip, items) {
  const img = new Image();
  img.src = `data:image/png;base64,${b64}`;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const lum = (r, g, b) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  return items.map((item) => {
    const x0 = Math.max(0, Math.floor(item.x - clip.x));
    const y0 = Math.max(0, Math.floor(item.y - clip.y));
    const x1 = Math.min(img.width, Math.ceil(item.x - clip.x + item.w));
    const y1 = Math.min(img.height, Math.ceil(item.y - clip.y + item.h));
    if (x1 - x0 < 2 || y1 - y0 < 2) return { ...item, ratio: null };
    const data = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data;
    const [cr, cg, cb, ca] = item.color;
    const ratios = [];
    const stride = Math.max(1, Math.floor(Math.sqrt((x1 - x0) * (y1 - y0) / 4000)));
    for (let y = 0; y < y1 - y0; y += stride) {
      for (let x = 0; x < x1 - x0; x += stride) {
        const i = (y * (x1 - x0) + x) * 4;
        const br = data[i], bg = data[i + 1], bb = data[i + 2];
        const fg = lum(ca * cr + (1 - ca) * br, ca * cg + (1 - ca) * bg, ca * cb + (1 - ca) * bb);
        const back = lum(br, bg, bb);
        ratios.push((Math.max(fg, back) + 0.05) / (Math.min(fg, back) + 0.05));
      }
    }
    ratios.sort((a, b) => a - b);
    return { ...item, ratio: ratios[Math.floor(ratios.length * 0.05)] };
  });
}

const HIDE_TEXT_CSS = `
  [data-contrast], [data-contrast] * {
    color: transparent !important; -webkit-text-fill-color: transparent !important;
    text-shadow: none !important; text-decoration-color: transparent !important; caret-color: transparent !important;
  }
  [data-contrast] ::placeholder { color: transparent !important; -webkit-text-fill-color: transparent !important; }
  body > header, #site-drawer, a[href="#main"] { visibility: hidden !important; }
`;

/** Measures every [data-contrast] target on the current page and viewport. Returns failures as strings. */
export async function measureContrast(page) {
  // Give empty fields a sample value so their text colour is measured too.
  await page.evaluate(() => {
    for (const field of document.querySelectorAll("[data-contrast] input:not([type=hidden]), [data-contrast] textarea")) {
      if (!field.value) {
        field.dataset.bzSample = "";
        field.value = "Camille Durand";
      }
    }
  });
  const targets = await page.evaluate(collectTargets);
  if (!targets.length) return { failures: [], worst: null };

  const style = await page.addStyleTag({ content: HIDE_TEXT_CSS });
  // The sticky header is hidden for the capture, but its paint can survive in a scrolled frame, so no
  // target is ever sampled inside the band it occupies: targets are scrolled to sit below it.
  const { vh, docH, top } = await page.evaluate(() => {
    const header = document.querySelector("body > header");
    const position = header ? getComputedStyle(header).position : "static";
    const band = position === "sticky" || position === "fixed" ? Math.ceil(header.getBoundingClientRect().height) : 0;
    return { vh: innerHeight, docH: document.documentElement.scrollHeight, top: band };
  });
  const pending = [...targets].sort((a, b) => a.y - b.y);
  const measured = [];
  try {
    while (pending.length) {
      const first = pending[0];
      const scroll = Math.max(0, Math.min(Math.floor(first.y - top - 40), docH - vh));
      await page.evaluate((y) => window.scrollTo(0, y), scroll);
      // Wait for the scrolled frame to be composited before capturing it.
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 30)))));
      const actual = await page.evaluate(() => scrollY);
      const inView = pending.filter((t) => t.y >= actual + top && t.y + t.h <= actual + vh);
      const batch = inView.length ? inView : [first];
      for (const t of batch) pending.splice(pending.indexOf(t), 1);
      if (!inView.length) {
        measured.push({ ...first, ratio: null });
        continue;
      }
      // Plain viewport capture: a clipped or beyond-viewport capture resizes the viewport, which
      // reflows vh/svh-sized sections and shifts everything under them.
      const b64 = await page.screenshot({ encoding: "base64", captureBeyondViewport: false, optimizeForSpeed: true });
      const local = batch.map((t) => ({ ...t, y: t.y - actual }));
      const results = await page.evaluate(sampleTargets, b64, { x: 0, y: 0 }, local);
      measured.push(...results);
      // CONTRAST_DEBUG_DIR=path keeps the frame behind any failing measurement, to see what the text sat on.
      if (process.env.CONTRAST_DEBUG_DIR && results.some((m) => m.ratio !== null && m.ratio < CONTRAST_MIN)) {
        const { mkdirSync, writeFileSync } = await import("node:fs");
        mkdirSync(process.env.CONTRAST_DEBUG_DIR, { recursive: true });
        const name = `${Date.now()}-${results.find((m) => m.ratio < CONTRAST_MIN).label.replace(/[^a-z0-9]+/gi, "-").slice(0, 30)}`;
        writeFileSync(`${process.env.CONTRAST_DEBUG_DIR}/${name}.png`, Buffer.from(b64, "base64"));
        writeFileSync(`${process.env.CONTRAST_DEBUG_DIR}/${name}.json`, JSON.stringify({ scrollY: actual, results: results.filter((m) => m.ratio < CONTRAST_MIN) }, null, 2));
      }
    }
  } finally {
    await style.evaluate((node) => node.remove());
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      for (const field of document.querySelectorAll("[data-bz-sample]")) {
        field.value = "";
        delete field.dataset.bzSample;
      }
    });
  }

  const scored = measured.filter((m) => m.ratio !== null);
  const failures = scored
    .filter((m) => m.ratio < CONTRAST_MIN)
    .map((m) => `${m.kind} "${m.label}" is ${m.ratio.toFixed(2)}:1`);
  const worst = scored.length ? Math.min(...scored.map((m) => m.ratio)) : null;
  return { failures: [...new Set(failures)], worst };
}

/**
 * Browser side: baked-in text in photos. An image may declare its sign areas as
 * data-text-zones="x1,y1,x2,y2;..." in the pixels of its source file (data-zones-width, default 1122).
 * Zones are mapped through object-fit: cover and object-position; any HTML text in the same section
 * that overlaps one fails.
 */
export function signsAudit() {
  const out = [];
  for (const img of document.querySelectorAll("img[data-text-zones]")) {
    if (!img.naturalWidth) {
      out.push("image with text zones not loaded");
      continue;
    }
    const box = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const rw = img.naturalWidth * scale;
    const rh = img.naturalHeight * scale;
    const [px, py] = cs.objectPosition.split(" ").map((v, i) =>
      v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v) / ((i === 0 ? box.width - rw : box.height - rh) || 1),
    );
    const left = box.left + (box.width - rw) * px;
    const top = box.top + (box.height - rh) * py;
    const sourceWidth = Number(img.dataset.zonesWidth || 1122);
    const k = (img.naturalWidth / sourceWidth) * scale;
    const zones = img.dataset.textZones.split(";").map((z) => {
      const [x1, y1, x2, y2] = z.split(",").map(Number);
      return { x1: left + x1 * k - 4, y1: top + y1 * k - 4, x2: left + x2 * k + 4, y2: top + y2 * k + 4 };
    });
    const section = img.closest("section") || document.body;
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (!text || node.parentElement.closest('[aria-hidden="true"], .sr-only')) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (r.width < 2) continue;
        for (const z of zones) {
          const hit = r.left < z.x2 && r.right > z.x1 && r.top < z.y2 && r.bottom > z.y1 && z.x2 > box.left && z.x1 < box.right && z.y2 > box.top && z.y1 < box.bottom;
          if (hit) out.push(`"${text.slice(0, 30)}" lies on baked-in sign text at ${Math.round(z.x1)},${Math.round(z.y1)}`);
        }
      }
    }
  }
  return [...new Set(out)];
}
