// Covered text, for the responsive gate.
//
// The overlap and clipped checks read geometry: a text box escaping its section, content past the
// section's edge. They cannot see paint order, so text that sits inside its own box but under a
// photograph, or under the next section, passes them. This check asks the browser instead: at points
// along the first and last line of every piece of text in <main>, which element is actually on top?
// If it is not the text's own element (or one of its ancestors or descendants), something is covering
// it: a photograph laid over it, a section painted on top of it, a band too short to show it.

/** Browser side: sample points (document coordinates) along the first and last line of each text run. */
function collectPoints() {
  const visible = (el) => {
    if (el.closest('[aria-hidden="true"]')) return false;
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
      if (cs.clip && cs.clip !== "auto") return false;
      if (cs.clipPath && cs.clipPath !== "none") return false;
    }
    return true;
  };
  const points = [];
  const main = document.querySelector("main");
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  let id = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.trim();
    const el = node.parentElement;
    if (!text || !el || !visible(el)) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter((r) => r.width > 6 && r.height > 6);
    if (!rects.length) continue;
    el.dataset.bzLayer = el.dataset.bzLayer || String(id++);
    const lines = rects.length > 1 ? [rects[0], rects[rects.length - 1]] : [rects[0]];
    for (const r of lines) {
      for (const fx of [0.15, 0.5, 0.85]) {
        points.push({ key: el.dataset.bzLayer, label: text.slice(0, 40), x: r.left + r.width * fx, y: r.top + r.height / 2 + scrollY });
      }
    }
  }
  return points;
}

/** Browser side: which of these points (already in the viewport) are covered by something else. */
function testPoints(points, headerBand) {
  const covered = [];
  for (const p of points) {
    const y = p.y - scrollY;
    if (y < headerBand + 2 || y > innerHeight - 2 || p.x < 1 || p.x > innerWidth - 1) continue;
    const el = document.querySelector(`[data-bz-layer="${p.key}"]`);
    const top = document.elementFromPoint(p.x, y);
    if (!el || !top) continue;
    if (top === el || el.contains(top) || top.contains(el)) continue;
    const what = top.tagName === "IMG" ? `a photo (${(top.getAttribute("alt") || "").slice(0, 30)})` : `<${top.tagName.toLowerCase()}${top.closest("section")?.id ? ` in #${top.closest("section").id}` : ""}>`;
    covered.push(`"${p.label}" is covered by ${what}`);
  }
  return covered;
}

/** Scrolls through the page and returns every piece of text that is not on top where it is drawn. */
export async function coveredAudit(page) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  });
  const points = await page.evaluate(collectPoints);
  const { vh, docH, headerBand } = await page.evaluate(() => {
    const header = document.querySelector("body > header");
    const position = header ? getComputedStyle(header).position : "static";
    return {
      vh: innerHeight,
      docH: document.documentElement.scrollHeight,
      headerBand: position === "sticky" || position === "fixed" ? Math.ceil(header.getBoundingClientRect().height) : 0,
    };
  });
  const found = new Set();
  const step = Math.max(200, vh - headerBand - 40);
  for (let y = 0; y < docH; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const actual = await page.evaluate(() => scrollY);
    // At the top of the page nothing is under the header yet, so no band needs excluding.
    const band = actual === 0 ? 0 : headerBand;
    const inView = points.filter((p) => p.y >= actual && p.y <= actual + vh);
    for (const msg of await page.evaluate(testPoints, inView, band)) found.add(msg);
    if (actual + vh >= docH) break;
  }
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    for (const el of document.querySelectorAll("[data-bz-layer]")) delete el.dataset.bzLayer;
  });
  return [...found];
}
