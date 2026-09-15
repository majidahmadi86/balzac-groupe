import { type Locale, type PageKey } from "./i18n";

// Same slugs under both trees: /vision and /fr/vision.
export const slugs: Record<PageKey, string> = {
  home: "",
  houses: "houses",
  vision: "vision",
  franchise: "franchise",
  news: "news",
  contact: "contact",
  legal: "legal",
  privacy: "privacy",
};

export const mainNav = ["home", "houses", "vision", "franchise", "news", "contact"] as const satisfies readonly PageKey[];
export const legalNav = ["legal", "privacy"] as const satisfies readonly PageKey[];

export function pathFor(locale: Locale, page: PageKey): string {
  const slug = slugs[page];
  if (locale === "fr") return slug ? `/fr/${slug}` : "/fr";
  return slug ? `/${slug}` : "/";
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

/** Path without the locale prefix, always starting with "/". */
export function stripLocale(pathname: string): string {
  if (pathname === "/fr") return "/";
  if (pathname.startsWith("/fr/")) return pathname.slice(3);
  return pathname || "/";
}

/** The same page in the other language, preserving the current path. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const base = stripLocale(pathname);
  if (target === "fr") return base === "/" ? "/fr" : `/fr${base}`;
  return base;
}

export function isActive(pathname: string, locale: Locale, page: PageKey): boolean {
  const href = pathFor(locale, page);
  if (page === "home") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
