import type { Locale } from "./i18n";

// Single source of truth for the legal entity and every legal fact the site
// states. Nothing else in the codebase names an entity.

/** Operating entity that publishes balzacgroupe.com. Not yet registered, so no registration number exists. */
export const LEGAL_ENTITY_NAME = "Balzac International Corp";

export const SITE_DOMAIN = "balzacgroupe.com";

/** City and country where LEGAL_ENTITY_NAME is based. */
export const ENTITY_LOCATION: Record<Locale, string> = { en: "Dublin, Ireland", fr: "Dublin, Irlande" };

/** Law governing the site and its legal notices, as it reads inside a sentence. */
export const APPLICABLE_LAW: Record<Locale, string> = { en: "the law of Ireland", fr: "le droit irlandais" };

/** How long form submissions are kept before deletion. */
export const FORM_RETENTION_PERIOD: Record<Locale, string> = { en: "24 months", fr: "24 mois" };

const copyright: Record<Locale, string> = {
  en: `© Groupe Balzac · ${LEGAL_ENTITY_NAME}`,
  fr: `© Groupe Balzac · ${LEGAL_ENTITY_NAME}`,
};

export function copyrightLine(locale: Locale): string {
  return copyright[locale];
}

// Facts not supplied yet are never invented and never shown as a placeholder: while a value is null
// its whole line is left out of /legal and /privacy. Filling one is a one-line change here, and the
// line appears.

/** Person responsible for publication (directeur de la publication): the group's founder. */
export const PUBLICATION_DIRECTOR: string | null = "Chango Zaza Favre";
/** Hosting provider name and address. */
export const HOSTING_PROVIDER: string | null = "Hostinger, Singapore";
/** Data protection officer, if one is appointed. */
export const DPO_NAME: string | null = null;

// No public email address anywhere on the site: personal data requests and every other
// message go through the /contact form, delivered server-side to CONTACT_TO_EMAIL.

/** Email delivery processor used by the Contact and Franchise forms. */
export const FORM_EMAIL_PROCESSOR = "Resend";
/** Anti-spam check on the Contact and Franchise forms. */
export const FORM_CAPTCHA_PROCESSOR = "Cloudflare Turnstile";

/** Fields collected by the two site forms. Keep in step with the forms themselves. */
export const FORM_FIELDS: Record<Locale, { contact: string[]; franchise: string[] }> = {
  en: {
    contact: ["name", "email address", "subject", "message"],
    franchise: ["name", "email address", "city and country", "message"],
  },
  fr: {
    contact: ["nom", "adresse email", "objet", "message"],
    franchise: ["nom", "adresse email", "ville et pays", "message"],
  },
};
