// Horizontal overflow sweep against a running build, every route in both languages.
//   BASE_URL=http://localhost:3000 npm run check:overflow
// Uses a local Chrome/Edge (or BROWSER_PATH), or attaches to CDP_URL.
import { openBrowser } from "./lib/browser.mjs";
import { BASE_URL, routePairs } from "./lib/site.mjs";

const WIDTHS = [320, 360, 375, 390, 414, 600, 768, 820, 1024, 1280, 1440, 1920];
const paths = routePairs().flatMap((pair) => [pair.en, pair.fr]);

const { browser, close } = await openBrowser();
const failures = [];
try {
  const page = await browser.newPage();
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
    for (const path of paths) {
      await page.goto(BASE_URL + path, { waitUntil: "networkidle0" });
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      if (scrollWidth > clientWidth) failures.push(`${path} at ${width}px: page is ${scrollWidth}px wide in a ${clientWidth}px viewport`);
    }
  }
  await page.close();
} finally {
  await close();
}

if (failures.length) {
  console.error(`check:overflow FAILED (${failures.length})\n${failures.map((f) => `  ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(`check:overflow ok · ${paths.length} pages x ${WIDTHS.length} widths (${WIDTHS[0]} to ${WIDTHS[WIDTHS.length - 1]}px)`);
