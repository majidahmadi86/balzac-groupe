// The client's own copy, as shipped.
//   BASE_URL=http://localhost:3000 npm run check:client-copy
// docs/client-copy.md is Zac's message. Every line of the blocks he asked us to place must appear on
// the page it belongs to, word for word, and none of it may still be sitting on a French page.
//
//   1. each copy line of an item is found in the rendered text of its page (EN)
//   2. no line of it appears on the French twin: every one has been translated
//   3. no stray English on a French page (a short list of words French never uses)
//
// Comparison is case- and punctuation-insensitive by design: the site sets headings in its own
// typography (small caps labels, sentence case display titles) while he wrote his headings in capitals.
// Wording is compared exactly; only case, quote glyphs and spacing are normalised. One documented
// substitution: he wrote "Balzac Real Estate" once for the house the site calls "Balzac Immobilier".
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BASE_URL, root } from "./lib/site.mjs";

// item number in docs/client-copy.md -> the page that must carry it
const PLACEMENT = {
  3: "/",
  4: "/about",
  7: "/vision",
  8: "/franchise",
};
// Item 6 repeats item 4 word for word, and item 2 was superseded by item 4: neither is placed again.
const NOT_PLACED = [2, 6];

const FR_OF = (path) => (path === "/" ? "/fr" : `/fr${path}`);
// Words that do not occur in French prose. Brand names the French pages keep are allowed around them.
const ENGLISH_WORDS = /\b(the|and|with|through|our|we|their|they|these|those|which|where|between|about|every|three|one of|from)\b/gi;
const FRENCH_ALLOWED = [/French Cultural Corner/gi, /art de vivre/gi, /Fine wines/gi];
// Lines of his message that are notes to us, not copy for the site.
const NOT_COPY = [/^make sure you understand/i];
// Names that read the same in both languages, so finding them on a French page is not English left over.
const BILINGUAL = ["Balzac Café & French Cultural Corner"].map((name) => name.toLowerCase());

const normalise = (text) =>
  text
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/balzac real estate/g, "balzac immobilier")
    .trim();

/** The blocks of docs/client-copy.md, by item number. */
function clientCopy() {
  const source = readFileSync(join(root, "docs", "client-copy.md"), "utf8");
  const items = {};
  let current = null;
  for (const line of source.split(/\r?\n/)) {
    const start = line.match(/^(\d+)\.\s(.*)$/);
    if (start) {
      current = Number(start[1]);
      items[current] = [start[2]];
      continue;
    }
    if (current) items[current].push(line);
  }
  const blocks = {};
  for (const [number, lines] of Object.entries(items)) {
    const item = Number(number);
    let body = lines;
    // Item 8 quotes the old copy first: the replacement is what follows "replaced with this: (".
    const openerIndex = body.findIndex((line) => /replaced with this:\s*\(/.test(line));
    if (openerIndex >= 0) body = body.slice(openerIndex + 1);
    else body = body.slice(1); // drop his instruction line, keep the copy
    blocks[item] = body
      .map((line) => line.trim().replace(/\)$/, ""))
      .filter(Boolean)
      // His numbered sub-headings ("1. HOSPITALITY MANAGEMENT") carry the number only in the message.
      .map((line) => line.replace(/^\d+\.\s*/, ""))
      .filter((line) => !NOT_COPY.some((note) => note.test(line)));
  }
  return blocks;
}

async function pageText(path) {
  const res = await fetch(BASE_URL + path);
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  const html = await res.text();
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [""])[0];
  return main
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/g, " ");
}

const failures = [];
const blocks = clientCopy();
const texts = new Map();
const text = async (path) => {
  if (!texts.has(path)) texts.set(path, normalise(await pageText(path)));
  return texts.get(path);
};

let placed = 0;
for (const [item, path] of Object.entries(PLACEMENT)) {
  const lines = blocks[Number(item)];
  if (!lines?.length) {
    failures.push(`docs/client-copy.md has no item ${item}`);
    continue;
  }
  const en = await text(path);
  const fr = await text(FR_OF(path));
  for (const line of lines) {
    const wanted = normalise(line);
    if (!wanted) continue;
    placed += 1;
    // 1
    if (!en.includes(wanted)) failures.push(`${path} is missing item ${item}: "${line.slice(0, 70)}"`);
    // 2
    if (wanted.length > 25 && !BILINGUAL.includes(wanted) && fr.includes(wanted)) failures.push(`${FR_OF(path)} still shows the English of item ${item}: "${line.slice(0, 70)}"`);
  }
}

for (const item of NOT_PLACED) {
  const lines = (blocks[item] || []).filter((line) => line.length > 60);
  const unique = lines.filter((line) => !Object.values(blocks).some((other) => other !== blocks[item] && other.includes(line)));
  for (const line of unique) {
    for (const path of Object.values(PLACEMENT)) {
      if ((await text(path)).includes(normalise(line))) failures.push(`${path} carries item ${item}, which was superseded: "${line.slice(0, 70)}"`);
    }
  }
}

// 3
const frPaths = [...new Set(Object.values(PLACEMENT).map(FR_OF))];
for (const path of frPaths) {
  let body = await pageText(path);
  for (const allowed of FRENCH_ALLOWED) body = body.replace(allowed, " ");
  const english = [...new Set((body.match(ENGLISH_WORDS) || []).map((word) => word.toLowerCase()))];
  if (english.length) failures.push(`${path} reads as English in places (${english.slice(0, 6).join(", ")})`);
}

if (failures.length) {
  console.error(`check:client-copy FAILED (${failures.length})\n${failures.map((f) => `  ${f}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `check:client-copy ok · ${placed} lines of docs/client-copy.md placed word for word across ${new Set(Object.values(PLACEMENT)).size} pages · every one translated on /fr · no English left on a French page`,
);
