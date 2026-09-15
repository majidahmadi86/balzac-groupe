export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const pageKeys = ["home", "houses", "vision", "franchise", "news", "contact", "legal", "privacy"] as const;
export type PageKey = (typeof pageKeys)[number];

// FR copy is verbatim from docs/mockup-mobile.jpg and docs/mockup-desktop.jpg.
// EN is a translation of the FR in the same editorial register.
// Copy rules: no em dash, no emoji. Separator is the middle dot.
const fr = {
  htmlLang: "fr",
  ogLocale: "fr_FR",
  siteName: "Groupe Balzac",
  tagline: "Culture · Patrimoine · Art de vivre",
  motto: "Des lieux, des objets, des histoires.",
  heroLead:
    "Nous créons et développons des lieux, des objets et des opportunités immobilières qui ont une âme, en France, en Suisse et à l’international.",
  nav: {
    home: "Accueil",
    houses: "Nos maisons",
    vision: "Notre vision",
    franchise: "Franchise",
    news: "Actualités",
    contact: "Contact",
  },
  legalNav: {
    legal: "Mentions légales",
    privacy: "Politique de confidentialité",
  },
  header: {
    menu: "Menu",
    close: "Fermer",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    primaryNav: "Navigation principale",
    language: "Langue",
    homeLink: "Groupe Balzac, accueil",
    skip: "Aller au contenu",
  },
  footer: {
    footerNav: "Navigation du pied de page",
    social: "Réseaux sociaux",
    copyright: "© Groupe Balzac · Une société du groupe Outsiders Corp. Ltd",
  },
  pages: {
    home: { title: "Accueil", eyebrow: "Groupe Balzac" },
    houses: { title: "Nos maisons", eyebrow: "Groupe Balzac" },
    vision: { title: "Notre vision", eyebrow: "Groupe Balzac" },
    franchise: { title: "Franchise", eyebrow: "Franchise internationale" },
    news: { title: "Actualités", eyebrow: "Groupe Balzac" },
    contact: { title: "Contact", eyebrow: "Groupe Balzac" },
    legal: { title: "Mentions légales", eyebrow: "Informations" },
    privacy: { title: "Politique de confidentialité", eyebrow: "Informations" },
  },
  stub: {
    placeholder: "Cette page est en préparation. Elle sera bientôt disponible.",
    back: "Retour à l’accueil",
  },
  notFound: {
    eyebrow: "Erreur 404",
    title: "Page introuvable.",
    body: "La page que vous cherchez n’existe pas ou a été déplacée.",
  },
};

export type Dictionary = typeof fr;

const en: Dictionary = {
  htmlLang: "en",
  ogLocale: "en_US",
  siteName: "Groupe Balzac",
  tagline: "Culture · Heritage · Art de vivre",
  motto: "Places, objects, stories.",
  heroLead:
    "We create and develop places, objects and property opportunities with a soul, in France, in Switzerland and around the world.",
  nav: {
    home: "Home",
    houses: "Our Houses",
    vision: "Our Vision",
    franchise: "Franchise",
    news: "News",
    contact: "Contact",
  },
  legalNav: {
    legal: "Legal Notice",
    privacy: "Privacy Policy",
  },
  header: {
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryNav: "Main navigation",
    language: "Language",
    homeLink: "Groupe Balzac, home",
    skip: "Skip to content",
  },
  footer: {
    footerNav: "Footer navigation",
    social: "Social media",
    copyright: "© Groupe Balzac · A company of the Outsiders Corp. Ltd group",
  },
  pages: {
    home: { title: "Home", eyebrow: "Groupe Balzac" },
    houses: { title: "Our Houses", eyebrow: "Groupe Balzac" },
    vision: { title: "Our Vision", eyebrow: "Groupe Balzac" },
    franchise: { title: "Franchise", eyebrow: "International franchise" },
    news: { title: "News", eyebrow: "Groupe Balzac" },
    contact: { title: "Contact", eyebrow: "Groupe Balzac" },
    legal: { title: "Legal Notice", eyebrow: "Information" },
    privacy: { title: "Privacy Policy", eyebrow: "Information" },
  },
  stub: {
    placeholder: "This page is in preparation and will be available soon.",
    back: "Back to home",
  },
  notFound: {
    eyebrow: "Error 404",
    title: "Page not found.",
    body: "The page you are looking for does not exist or has moved.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
