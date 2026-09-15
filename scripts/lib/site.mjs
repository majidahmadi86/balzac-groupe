import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

function pagesUnder(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...pagesUnder(full));
    else if (name === "page.tsx") out.push(full);
  }
  return out;
}

/** Static routes, derived from the app directory: [{ en: "/vision", fr: "/fr/vision" }, ...]. */
export function routePairs() {
  const toSlug = (base, file) =>
    relative(base, dirname(file))
      .split(/[\\/]/)
      .filter(Boolean)
      .join("/");
  const en = pagesUnder(join(root, "app", "(en)")).map((f) => toSlug(join(root, "app", "(en)"), f));
  const fr = pagesUnder(join(root, "app", "fr"))
    .map((f) => toSlug(join(root, "app", "fr"), f))
    .filter((slug) => !slug.includes("["));
  const slugs = [...new Set([...en, ...fr])].sort();
  return slugs.map((slug) => ({ slug, en: slug ? `/${slug}` : "/", fr: slug ? `/fr/${slug}` : "/fr", inEn: en.includes(slug), inFr: fr.includes(slug) }));
}

/** Visibility flags in lib/routes.ts. */
export function flags() {
  const source = readFileSync(join(root, "lib", "routes.ts"), "utf8");
  return {
    news: /export const SHOW_NEWS = true/.test(source),
    immobilier: /export const SHOW_IMMOBILIER = true/.test(source),
  };
}

/** Nav items hidden by a visibility flag in lib/routes.ts (currently SHOW_NEWS). */
export function hiddenSlugs() {
  const source = readFileSync(join(root, "lib", "routes.ts"), "utf8");
  const hidden = [];
  if (/export const SHOW_NEWS = false/.test(source)) hidden.push("news");
  return hidden;
}
