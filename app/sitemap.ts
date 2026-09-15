import type { MetadataRoute } from "next";
import { pageKeys, type PageKey } from "@/lib/i18n";
import { siteUrl } from "@/lib/metadata";
import { pathFor, SHOW_NEWS } from "@/lib/routes";

// Every live route in both languages, each with its hreflang alternates.
// Routes hidden by a visibility flag stay out of the sitemap.
const hidden: PageKey[] = SHOW_NEWS ? [] : ["news"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = pageKeys.filter((page) => !hidden.includes(page));
  return pages.flatMap((page) => {
    const languages = {
      en: `${siteUrl}${pathFor("en", page)}`,
      fr: `${siteUrl}${pathFor("fr", page)}`,
      "x-default": `${siteUrl}${pathFor("en", page)}`,
    };
    return (["en", "fr"] as const).map((locale) => ({
      url: `${siteUrl}${pathFor(locale, page)}`,
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
