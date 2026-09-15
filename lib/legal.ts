import type { Locale } from "./i18n";

// Single source of truth for the legal entity and every legal fact the site
// states. Nothing else in the codebase names an entity.

/** Operating entity that publishes balzacgroupe.com. */
export const LEGAL_ENTITY_NAME = "Balzac International Ltd";

export const SITE_DOMAIN = "balzacgroupe.com";

const copyright: Record<Locale, string> = {
  en: `© Groupe Balzac · ${LEGAL_ENTITY_NAME}`,
  fr: `© Groupe Balzac · ${LEGAL_ENTITY_NAME}`,
};

export function copyrightLine(locale: Locale): string {
  return copyright[locale];
}

// Facts not yet supplied. They are deliberately NOT invented: while a value is
// null, the legal pages print a visible "to be confirmed" marker in its place.
// Filling one is a one-line change here.

/** Law and courts governing the site and its legal notices. */
export const APPLICABLE_LAW: string | null = null;
/** Registered office address of LEGAL_ENTITY_NAME. */
export const REGISTERED_ADDRESS: string | null = null;
/** Company registration number of LEGAL_ENTITY_NAME. */
export const REGISTRATION_NUMBER: string | null = null;
/** Person responsible for publication (directeur de la publication). */
export const PUBLICATION_DIRECTOR: string | null = null;
/** Hosting provider name and address. */
export const HOSTING_PROVIDER: string | null = null;
/** Dedicated email address for personal data requests, if any (the Contact page is the route meanwhile). */
export const PRIVACY_CONTACT_EMAIL: string | null = null;
/** Data protection officer, if one is appointed. */
export const DPO_NAME: string | null = null;
/** How long form submissions are kept before deletion. */
export const FORM_RETENTION_PERIOD: Record<Locale, string | null> = { en: null, fr: null };

/**
 * Public group email shown on /contact and as the fallback when a form cannot be sent.
 * Not yet supplied: while null, the page shows a "to be confirmed" marker instead.
 */
export const GROUP_EMAIL: string | null = null;

/** Email delivery processor used by the Contact and Franchise forms. */
export const FORM_EMAIL_PROCESSOR = "Resend";

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
