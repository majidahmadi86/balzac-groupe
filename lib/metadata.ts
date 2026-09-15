import type { Metadata } from "next";
import { getDictionary, type Locale, type PageKey } from "./i18n";
import { pathFor } from "./routes";

export const siteUrl = "https://balzacgroupe.com";

export function localeLayoutMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${t.siteName} · ${t.motto}`,
      template: `%s · ${t.siteName}`,
    },
    description: t.heroLead,
    applicationName: t.siteName,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export function pageMetadata(locale: Locale, page: PageKey, description?: string): Metadata {
  const t = getDictionary(locale);
  const path = pathFor(locale, page);
  const summary = description ?? t.heroLead;
  // Explicit per locale: a page-level openGraph object replaces the one Next derives
  // from app/opengraph-image.png, so the card must be named here to reach every route.
  const cardBase = locale === "fr" ? "/fr" : "";
  const cardAlt = `${t.siteName} · ${t.motto}`;
  const title = page === "home" ? `${t.siteName} · ${t.motto}` : `${t.pages[page].title} · ${t.siteName}`;

  return {
    title: page === "home" ? { absolute: title } : t.pages[page].title,
    description: summary,
    alternates: {
      canonical: path,
      languages: {
        en: pathFor("en", page),
        fr: pathFor("fr", page),
        "x-default": pathFor("en", page),
      },
    },
    openGraph: {
      type: "website",
      siteName: t.siteName,
      locale: t.ogLocale,
      alternateLocale: [getDictionary(locale === "fr" ? "en" : "fr").ogLocale],
      url: path,
      title,
      description: summary,
      images: [{ url: `${cardBase}/opengraph-image.png`, width: 1200, height: 630, alt: cardAlt, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: [{ url: `${cardBase}/twitter-image.png`, width: 1200, height: 630, alt: cardAlt }],
    },
  };
}
