import type { Locale, PageKey } from "./i18n";
import {
  APPLICABLE_LAW,
  DPO_NAME,
  FORM_EMAIL_PROCESSOR,
  FORM_FIELDS,
  FORM_RETENTION_PERIOD,
  HOSTING_PROVIDER,
  LEGAL_ENTITY_NAME,
  PRIVACY_CONTACT_EMAIL,
  PUBLICATION_DIRECTOR,
  REGISTERED_ADDRESS,
  REGISTRATION_NUMBER,
  SITE_DOMAIN,
} from "./legal";

// Typeset copy for /legal and /privacy. Every fact comes from lib/legal.ts;
// a null fact becomes { pending } and renders as a visible "to be confirmed" marker.

export type Inline = string | { pending: string } | { link: PageKey; text: string };
export type LegalBlock = { type: "p"; parts: Inline[] } | { type: "facts"; items: { label: string; value: Inline[] }[] };
export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };
export type LegalDoc = {
  hero: { label: string; title: string; intro: string; imageAlt: string };
  sections: LegalSection[];
};

const fact = (value: string | null, name: string): Inline[] => [value ?? { pending: name }];
const p = (...parts: Inline[]): LegalBlock => ({ type: "p", parts });
const list = (items: string[], locale: Locale) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ${locale === "fr" ? "et" : "and"} ${items[items.length - 1]}`;

const imageAlt = {
  en: "A Balzac book, a marble bust and an olive branch in a vase on a mantelpiece",
  fr: "Livre Balzac, buste en marbre et vase d’olivier sur une cheminée",
};

export function legalNotice(locale: Locale): LegalDoc {
  if (locale === "fr") {
    return {
      hero: {
        label: "Informations",
        title: "Mentions légales.",
        intro: `L’éditeur du site ${SITE_DOMAIN}, son hébergement et les règles qui s’y appliquent.`,
        imageAlt: imageAlt.fr,
      },
      sections: [
        {
          id: "editeur",
          title: "Éditeur du site",
          blocks: [
            p(`Le site ${SITE_DOMAIN} est édité par ${LEGAL_ENTITY_NAME}.`),
            {
              type: "facts",
              items: [
                { label: "Société", value: [LEGAL_ENTITY_NAME] },
                { label: "Siège social", value: fact(REGISTERED_ADDRESS, "REGISTERED_ADDRESS") },
                { label: "Immatriculation", value: fact(REGISTRATION_NUMBER, "REGISTRATION_NUMBER") },
                { label: "Directeur de la publication", value: fact(PUBLICATION_DIRECTOR, "PUBLICATION_DIRECTOR") },
                { label: "Contact", value: [{ link: "contact", text: "Page Contact" }] },
              ],
            },
          ],
        },
        {
          id: "hebergement",
          title: "Hébergement",
          blocks: [
            p("Le site est hébergé par le prestataire suivant."),
            { type: "facts", items: [{ label: "Hébergeur", value: fact(HOSTING_PROVIDER, "HOSTING_PROVIDER") }] },
          ],
        },
        {
          id: "propriete-intellectuelle",
          title: "Propriété intellectuelle",
          blocks: [
            p(
              "L’ensemble des contenus de ce site, notamment les textes, les images, les logotypes et les éléments graphiques, est protégé par le droit de la propriété intellectuelle.",
            ),
            p(
              `Toute reproduction, représentation ou adaptation, totale ou partielle, sans l’autorisation écrite préalable de ${LEGAL_ENTITY_NAME} est interdite. Les noms et logotypes Groupe Balzac, Balzac Café, Balzac Antiques et Balzac Immobilier ne peuvent être utilisés sans cette autorisation.`,
            ),
          ],
        },
        {
          id: "donnees-personnelles",
          title: "Données personnelles et cookies",
          blocks: [
            p(
              "Le traitement des informations transmises via les formulaires du site et l’usage des cookies sont décrits dans la ",
              { link: "privacy", text: "politique de confidentialité" },
              ".",
            ),
          ],
        },
        {
          id: "droit-applicable",
          title: "Droit applicable",
          blocks: [
            p("Les présentes mentions légales et l’utilisation du site sont régies par le droit suivant : ", ...fact(APPLICABLE_LAW, "APPLICABLE_LAW"), "."),
          ],
        },
      ],
    };
  }

  return {
    hero: {
      label: "Information",
      title: "Legal notice.",
      intro: `The publisher of ${SITE_DOMAIN}, its hosting and the rules that apply to it.`,
      imageAlt: imageAlt.en,
    },
    sections: [
      {
        id: "editeur",
        title: "Publisher",
        blocks: [
          p(`${SITE_DOMAIN} is published by ${LEGAL_ENTITY_NAME}.`),
          {
            type: "facts",
            items: [
              { label: "Company", value: [LEGAL_ENTITY_NAME] },
              { label: "Registered office", value: fact(REGISTERED_ADDRESS, "REGISTERED_ADDRESS") },
              { label: "Registration number", value: fact(REGISTRATION_NUMBER, "REGISTRATION_NUMBER") },
              { label: "Publication director", value: fact(PUBLICATION_DIRECTOR, "PUBLICATION_DIRECTOR") },
              { label: "Contact", value: [{ link: "contact", text: "Contact page" }] },
            ],
          },
        ],
      },
      {
        id: "hebergement",
        title: "Hosting",
        blocks: [
          p("The site is hosted by the following provider."),
          { type: "facts", items: [{ label: "Hosting provider", value: fact(HOSTING_PROVIDER, "HOSTING_PROVIDER") }] },
        ],
      },
      {
        id: "propriete-intellectuelle",
        title: "Intellectual property",
        blocks: [
          p("All content on this site, including text, images, logos and graphic elements, is protected by intellectual property law."),
          p(
            `Any reproduction, representation or adaptation, in whole or in part, without the prior written permission of ${LEGAL_ENTITY_NAME} is prohibited. The names and logos Groupe Balzac, Balzac Café, Balzac Antiques and Balzac Immobilier may not be used without that permission.`,
          ),
        ],
      },
      {
        id: "donnees-personnelles",
        title: "Personal data and cookies",
        blocks: [
          p(
            "How information sent through the site’s forms is handled, and how cookies are used, is described in the ",
            { link: "privacy", text: "privacy policy" },
            ".",
          ),
        ],
      },
      {
        id: "droit-applicable",
        title: "Applicable law",
        blocks: [p("This legal notice and the use of the site are governed by the following law: ", ...fact(APPLICABLE_LAW, "APPLICABLE_LAW"), ".")],
      },
    ],
  };
}

export function privacyPolicy(locale: Locale): LegalDoc {
  const fields = FORM_FIELDS[locale];
  const retention = fact(FORM_RETENTION_PERIOD[locale], "FORM_RETENTION_PERIOD");

  if (locale === "fr") {
    return {
      hero: {
        label: "Informations",
        title: "Politique de confidentialité.",
        intro: "Ce que nous faisons des informations que vous nous confiez sur ce site.",
        imageAlt: imageAlt.fr,
      },
      sections: [
        {
          id: "responsable",
          title: "Responsable du traitement",
          blocks: [
            p(`${LEGAL_ENTITY_NAME} est responsable des traitements de données personnelles réalisés via ce site.`),
            {
              type: "facts",
              items: [
                { label: "Société", value: [LEGAL_ENTITY_NAME] },
                { label: "Demandes", value: [{ link: "contact", text: "Page Contact" }] },
                { label: "Adresse dédiée", value: fact(PRIVACY_CONTACT_EMAIL, "PRIVACY_CONTACT_EMAIL") },
                { label: "Délégué à la protection des données", value: fact(DPO_NAME, "DPO_NAME") },
              ],
            },
          ],
        },
        {
          id: "donnees-collectees",
          title: "Données collectées",
          blocks: [
            p("Le site ne collecte des données personnelles qu’au travers de deux formulaires, et uniquement les informations que vous choisissez d’y saisir."),
            {
              type: "facts",
              items: [
                { label: "Formulaire de contact", value: [list(fields.contact, locale)] },
                { label: "Formulaire franchise", value: [list(fields.franchise, locale)] },
              ],
            },
          ],
        },
        {
          id: "finalites",
          title: "Finalités",
          blocks: [
            p(
              "Ces informations servent uniquement à répondre à votre message et, pour le formulaire franchise, à étudier votre projet d’ouverture. Elles ne sont ni vendues, ni louées, ni utilisées à des fins publicitaires.",
            ),
          ],
        },
        {
          id: "conservation",
          title: "Durée de conservation",
          blocks: [p("Les informations transmises sont conservées pendant la durée suivante, puis supprimées : ", ...retention, ".")],
        },
        {
          id: "sous-traitant",
          title: "Sous-traitant",
          blocks: [
            p(
              `Les messages envoyés via les formulaires nous sont transmis par email grâce au service ${FORM_EMAIL_PROCESSOR}, qui agit en qualité de sous-traitant pour leur acheminement.`,
            ),
          ],
        },
        {
          id: "vos-droits",
          title: "Vos demandes",
          blocks: [
            p(
              "Vous pouvez demander à accéder aux informations vous concernant, à les faire rectifier ou supprimer, ou vous opposer à leur traitement. Adressez votre demande via la ",
              { link: "contact", text: "page Contact" },
              " ; nous y répondrons dans les meilleurs délais.",
            ),
          ],
        },
        {
          id: "cookies",
          title: "Cookies",
          blocks: [
            p("Ce site ne dépose aucun cookie de suivi, de mesure d’audience ou de publicité."),
            p("Seuls peuvent intervenir les éléments techniques strictement nécessaires au fonctionnement du site, fournis par son cadre technique (Next.js)."),
          ],
        },
      ],
    };
  }

  return {
    hero: {
      label: "Information",
      title: "Privacy policy.",
      intro: "What we do with the information you entrust to us on this site.",
      imageAlt: imageAlt.en,
    },
    sections: [
      {
        id: "responsable",
        title: "Data controller",
        blocks: [
          p(`${LEGAL_ENTITY_NAME} is responsible for the processing of personal data carried out through this site.`),
          {
            type: "facts",
            items: [
              { label: "Company", value: [LEGAL_ENTITY_NAME] },
              { label: "Requests", value: [{ link: "contact", text: "Contact page" }] },
              { label: "Dedicated address", value: fact(PRIVACY_CONTACT_EMAIL, "PRIVACY_CONTACT_EMAIL") },
              { label: "Data protection officer", value: fact(DPO_NAME, "DPO_NAME") },
            ],
          },
        ],
      },
      {
        id: "donnees-collectees",
        title: "Data collected",
        blocks: [
          p("The site collects personal data only through two forms, and only the information you choose to enter in them."),
          {
            type: "facts",
            items: [
              { label: "Contact form", value: [list(fields.contact, locale)] },
              { label: "Franchise form", value: [list(fields.franchise, locale)] },
            ],
          },
        ],
      },
      {
        id: "finalites",
        title: "Purpose",
        blocks: [
          p(
            "This information is used only to reply to your message and, for the franchise form, to consider your opening project. It is never sold, rented or used for advertising.",
          ),
        ],
      },
      {
        id: "conservation",
        title: "Retention",
        blocks: [p("Information sent to us is kept for the following period, then deleted: ", ...retention, ".")],
      },
      {
        id: "sous-traitant",
        title: "Processor",
        blocks: [
          p(
            `Messages sent through the forms reach us by email via ${FORM_EMAIL_PROCESSOR}, which acts as a processor for their delivery.`,
          ),
        ],
      },
      {
        id: "vos-droits",
        title: "Your requests",
        blocks: [
          p(
            "You may ask to access the information concerning you, to have it corrected or deleted, or object to its processing. Send your request through the ",
            { link: "contact", text: "Contact page" },
            " and we will reply as promptly as we can.",
          ),
        ],
      },
      {
        id: "cookies",
        title: "Cookies",
        blocks: [
          p("This site sets no tracking, analytics or advertising cookies."),
          p("Only the technical elements strictly needed for the site to work, as provided by its framework (Next.js), may be involved."),
        ],
      },
    ],
  };
}
