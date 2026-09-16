// Lighthouse against a running production build, every live route in both languages.
//   BASE_URL=http://localhost:3000 npm run check:lighthouse
// Fails the run when a page scores below the floors: SEO 100, accessibility 100, best practices 100 and
// performance 90. Performance is a lab measurement: on one machine the same unchanged page varies by
// several points between runs, so the floor here only catches a real regression. Set
// LIGHTHOUSE_MIN_PERFORMANCE=96 to hold the reference target on reference hardware.
// Prints every audit that did not pass, so a failure names its cause.
// Each page runs LIGHTHOUSE_RUNS times (default 3) and the median run by performance score is kept, as
// Lighthouse recommends for lab variance. LIGHTHOUSE_ONLY=home,contact limits the routes;
// LIGHTHOUSE_JSON=file writes the scores, metrics and failed audits.
import { writeFileSync } from "node:fs";
import lighthouse from "lighthouse";
import { openBrowser } from "./lib/browser.mjs";
import { BASE_URL, hiddenSlugs, routePairs } from "./lib/site.mjs";

const FLOORS = {
  performance: Number(process.env.LIGHTHOUSE_MIN_PERFORMANCE) || 90,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
};
const CATEGORIES = Object.keys(FLOORS);
const RUNS = Math.max(1, Number(process.env.LIGHTHOUSE_RUNS) || 3);
const METRICS = {
  "first-contentful-paint": "FCP",
  "largest-contentful-paint": "LCP",
  "total-blocking-time": "TBT",
  "cumulative-layout-shift": "CLS",
  "speed-index": "SI",
};
const only = process.env.LIGHTHOUSE_ONLY ? process.env.LIGHTHOUSE_ONLY.split(",") : null;
const hidden = hiddenSlugs();
const pages = routePairs()
  .filter((pair) => !hidden.includes(pair.slug))
  .filter((pair) => !only || only.includes(pair.slug || "home"))
  .flatMap((pair) => [pair.en, pair.fr]);

const { browser, close } = await openBrowser();
const port = Number(new URL(browser.wsEndpoint()).port);
const rows = [];
try {
  for (const path of pages) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      const { lhr } = await lighthouse(`${BASE_URL}${path}`, {
        port,
        output: "json",
        logLevel: "error",
        onlyCategories: CATEGORIES,
      });
      runs.push(lhr);
    }
    runs.sort((a, b) => (a.categories.performance?.score ?? 0) - (b.categories.performance?.score ?? 0));
    const lhr = runs[Math.floor(runs.length / 2)];
    const metrics = Object.fromEntries(Object.entries(METRICS).map(([id, name]) => [name, lhr.audits[id]?.displayValue ?? null]));
    const scores = Object.fromEntries(CATEGORIES.map((c) => [c, Math.round((lhr.categories[c]?.score ?? 0) * 100)]));
    const failed = [];
    for (const category of CATEGORIES) {
      if (category === "performance") continue;
      for (const ref of lhr.categories[category].auditRefs) {
        const audit = lhr.audits[ref.id];
        // Unscored (weight 0) audits cannot move the score; they are listed but marked.
        if (["notApplicable", "informative", "manual"].includes(audit.scoreDisplayMode)) continue;
        if (audit.score === null || audit.score >= 1) continue;
        const items = (audit.details?.items || [])
          .slice(0, 4)
          .map((item) => item.node?.snippet || item.source?.url || item.href || item.text || JSON.stringify(item).slice(0, 90));
        failed.push({ category, id: ref.id, title: ref.weight === 0 ? `${audit.title} (unscored)` : audit.title, items });
      }
    }
    if (lhr.runtimeError) failed.push({ category: "runtime", id: lhr.runtimeError.code, title: lhr.runtimeError.message, items: [] });
    const allPerformance = runs.map((r) => Math.round((r.categories.performance?.score ?? 0) * 100));
    rows.push({ path, scores, metrics, performanceRuns: allPerformance, failed });
    console.log(`${path.padEnd(16)} ${CATEGORIES.map((c) => `${c} ${scores[c]}`).join(" · ")}  (performance runs ${allPerformance.join("/")})`);
    console.log(`    ${Object.entries(metrics).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
    for (const f of failed) console.log(`    ${f.category} · ${f.id} · ${f.title}${f.items.length ? `\n      ${f.items.join("\n      ")}` : ""}`);
  }
} finally {
  await close();
}

if (process.env.LIGHTHOUSE_JSON) writeFileSync(process.env.LIGHTHOUSE_JSON, JSON.stringify(rows, null, 2));

const short = { performance: "perf", accessibility: "a11y", "best-practices": "bp", seo: "seo" };
console.log(`\nLighthouse · ${rows.length} pages\n`);
console.log(`| page | ${CATEGORIES.map((c) => short[c]).join(" | ")} |`);
console.log(`|${" --- |".repeat(CATEGORIES.length + 1)}`);
for (const row of rows) console.log(`| ${row.path} | ${CATEGORIES.map((c) => row.scores[c]).join(" | ")} |`);

const below = rows.flatMap((row) =>
  CATEGORIES.filter((c) => row.scores[c] < FLOORS[c]).map((c) => `${row.path} ${c} ${row.scores[c]} (floor ${FLOORS[c]})`),
);
if (below.length) {
  console.error(`\ncheck:lighthouse FAILED\n${below.join("\n")}`);
  process.exit(1);
}
console.log("\ncheck:lighthouse ok");
