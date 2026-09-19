// Copy and source hygiene. No server needed.
//   npm run check:copy
// Fails on: em dash or en dash anywhere (the client's copy in docs/ included), emoji anywhere, and
// any company-form entity name outside lib/legal.ts (the single source of truth).
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|pdf)$/i;
const DASHES = /[\u2013\u2014]/;
// Extended_Pictographic also covers the copyright and trademark signs, which are allowed.
const EMOJI = /(?![\u00a9\u00ae\u2122])\p{Extended_Pictographic}|\uFE0F/u;
const ENTITY = /\b(Ltd|Limited|Inc|Corp|LLC|SARL|SAS|GmbH|S\.A\.)\b/;
const ENTITY_ALLOWED = new Set(["lib/legal.ts"]);
const SOURCE = /^(app|components|lib)\/.*\.(ts|tsx|css)$/;

const files = execSync("git ls-files --cached --others --exclude-standard", { encoding: "utf8" })
  .split("\n")
  // docs/ holds the mockups (binary, skipped above) and the client's copy, which is text and checked.
  .filter((f) => f && !BINARY.test(f));

const failures = [];
for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  text.split("\n").forEach((line, idx) => {
    const where = `${file}:${idx + 1}`;
    if (DASHES.test(line)) failures.push(`dash   ${where}  ${line.trim().slice(0, 90)}`);
    if (EMOJI.test(line)) failures.push(`emoji  ${where}  ${line.trim().slice(0, 90)}`);
    if (SOURCE.test(file) && !ENTITY_ALLOWED.has(file) && ENTITY.test(line)) {
      failures.push(`entity ${where}  ${line.trim().slice(0, 90)}`);
    }
  });
}

// Commit messages follow the same copy rules.
const log = execSync("git log --format=%B", { encoding: "utf8" });
if (DASHES.test(log)) failures.push("dash   in a commit message");
if (EMOJI.test(log)) failures.push("emoji  in a commit message");

if (failures.length) {
  console.error(`check:copy FAILED (${failures.length})\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`check:copy ok · ${files.length} files · no dashes, no emoji, entity only in lib/legal.ts`);
