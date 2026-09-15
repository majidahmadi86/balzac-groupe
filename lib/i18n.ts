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
  home: {
    hero: {
      cta: "Découvrir le groupe",
      imageAlt: "Façade de la librairie, galerie et café Balzac, avec sa terrasse",
    },
    houses: {
      cafe: {
        label: "Balzac Café",
        title: "Une maison française contemporaine.",
        body: ["Librairie, galerie, café.", "Un lieu de culture, de rencontres et d’art de vivre."],
        cta: "Découvrir Balzac Café",
        imageAlt: "Tasse de café Balzac, croissant et bouquet de marguerites",
      },
      antiques: {
        label: "Balzac Antiques",
        title: "Des objets ayant une histoire.",
        body: ["Mobilier, objets d’art, collections.", "Pour des intérieurs d’exception."],
        cta: "Découvrir Balzac Antiques",
        imageAlt: "Buste en marbre, livres anciens et bougeoir sur une commode ancienne",
      },
      immobilier: {
        label: "Balzac Immobilier",
        title: "L’immobilier de caractère aux portes de la Suisse.",
        body: ["Spécialiste de la région de Pontarlier.", "Un accompagnement complet, de la recherche à la signature."],
        cta: "Découvrir Balzac Immobilier",
        imageAlt: "Maison de caractère en pierre sous la neige, entourée de sapins",
      },
    },
    franchise: {
      label: "Franchise internationale",
      title: "Ouvrez Balzac Café dans votre pays.",
      body: ["Rejoignez l’aventure et développez une maison française dans votre ville."],
      cta: "En savoir plus",
      imageAlt: "Globe ancien et pile de livres marqués Paris, Bangkok, New York, Tokyo",
    },
    vision: {
      label: "Notre vision",
      title: "Transmettre ce qui a du sens.",
      intro: "La beauté, la culture et le patrimoine créent des liens durables entre les hommes et les lieux.",
      pillars: {
        culture: { title: "Culture", caption: ["Des idées", "qui rassemblent."] },
        heritage: { title: "Patrimoine", caption: ["Des objets et des lieux", "qui traversent le temps."] },
        artDeVivre: { title: "Art de vivre", caption: ["Une certaine idée", "du beau et du bon."] },
        international: { title: "International", caption: ["Aujourd’hui ici,", "et demain ailleurs."] },
      },
    },
    newTab: "(s’ouvre dans un nouvel onglet)",
  },
  housesPage: {
    hero: {
      label: "Nos maisons",
      title: "Trois maisons, un même art de vivre.",
      intro: "Groupe Balzac réunit des activités complémentaires autour d’une même conviction.",
      imageAlt: "Une tasse Balzac Café, une commode ancienne et une maison de pierre sous la neige",
    },
    contactCta: "Prendre contact",
    cafe: {
      paragraphs: [
        "Librairie, galerie, café : Balzac Café réunit sous un même toit ce qui fait le charme d’une maison française. Un lieu où l’on vient lire, regarder, goûter et prendre le temps.",
        "Les livres et les affiches y côtoient les vins fins, le cinéma et la littérature. Chaque visite est une invitation à la rencontre et à la conversation.",
        "Un lieu de culture, de rencontres et d’art de vivre, pensé pour être partagé.",
      ],
      details: {
        title: "Dans la maison",
        items: ["Librairie", "Galerie", "Café", "Vins fins", "Cinéma et littérature"],
      },
    },
    antiques: {
      paragraphs: [
        "Balzac Antiques rassemble du mobilier, des objets d’art et des collections choisis pour leur caractère et pour ce qu’ils racontent.",
        "Chaque pièce porte la trace d’une époque et d’un savoir-faire. Elle trouve sa place dans des intérieurs d’exception, où le patrimoine se vit au quotidien.",
      ],
      details: {
        title: "La sélection",
        items: ["Mobilier", "Objets d’art", "Collections"],
      },
    },
    immobilier: {
      paragraphs: [
        "Spécialiste de la région de Pontarlier, Balzac Immobilier se consacre à l’immobilier de caractère, à ces lieux qui ont une âme.",
        "Nous proposons un accompagnement complet, de la recherche à la signature, avec l’attention que mérite chaque projet.",
      ],
      details: {
        title: "L’accompagnement",
        items: ["Recherche", "Accompagnement", "Signature", "Région de Pontarlier"],
      },
    },
  },
  visionPage: {
    hero: {
      label: "Notre vision",
      title: "Une même conviction.",
      intro: "Ce qui relie nos maisons, d’un lieu à l’autre.",
      imageAlt: "Livre Balzac, buste en marbre et vase d’olivier sur une cheminée",
    },
    statement: {
      label: "Groupe Balzac",
      paragraphs: [
        "La beauté, la culture et le patrimoine créent des liens durables entre les hommes et les lieux. C’est cette conviction qui relie chacune de nos maisons.",
        "Nous choisissons des objets et des lieux qui traversent le temps, pour les faire vivre et les transmettre à leur tour.",
        "Une certaine idée du beau et du bon guide notre manière d’accueillir, de choisir et d’accompagner.",
        "Présent en France, en Suisse et à l’international, cet art de vivre a vocation à voyager : aujourd’hui ici, et demain ailleurs.",
      ],
    },
    pillars: {
      label: "Nos piliers",
      title: "Quatre idées qui nous guident.",
      body: {
        culture: "La culture est au cœur de chaque maison : un lieu de partage, de curiosité et de conversation.",
        heritage: "Nous les choisissons pour leur caractère et nous attachons à les transmettre.",
        artDeVivre: "Elle se retrouve dans une tasse de café, un meuble ancien ou une maison de pierre.",
        international: "Balzac Café a vocation à s’ouvrir dans d’autres pays, portée par la franchise internationale.",
      },
    },
    closing: {
      label: "Poursuivre",
      title: "Partager cette vision.",
      body: "Ouvrir Balzac Café dans votre pays, ou simplement nous écrire.",
      franchiseCta: "Découvrir la franchise",
      contactCta: "Nous contacter",
    },
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
  home: {
    hero: {
      cta: "Discover the group",
      imageAlt: "The Balzac bookshop, gallery and café storefront with its terrace",
    },
    houses: {
      cafe: {
        label: "Balzac Café",
        title: "A contemporary French house.",
        body: ["Bookshop, gallery, café.", "A place for culture, encounters and the art of living."],
        cta: "Discover Balzac Café",
        imageAlt: "A Balzac coffee cup, a croissant and a small bouquet of daisies",
      },
      antiques: {
        label: "Balzac Antiques",
        title: "Objects with a story.",
        body: ["Furniture, works of art, collections.", "For exceptional interiors."],
        cta: "Discover Balzac Antiques",
        imageAlt: "A marble bust, antique books and a candlestick on an old chest",
      },
      immobilier: {
        label: "Balzac Immobilier",
        title: "Property of character at the gateway to Switzerland.",
        body: ["Specialists in the Pontarlier region.", "Complete guidance, from the first search to the signing."],
        cta: "Discover Balzac Immobilier",
        imageAlt: "A stone house of character in the snow, framed by fir trees",
      },
    },
    franchise: {
      label: "International franchise",
      title: "Open a Balzac Café in your country.",
      body: ["Join the adventure and bring a French house to your city."],
      cta: "Learn more",
      imageAlt: "An antique globe beside books marked Paris, Bangkok, New York, Tokyo",
    },
    vision: {
      label: "Our vision",
      title: "Passing on what matters.",
      intro: "Beauty, culture and heritage create lasting bonds between people and places.",
      pillars: {
        culture: { title: "Culture", caption: ["Ideas that", "bring people together."] },
        heritage: { title: "Heritage", caption: ["Objects and places", "that stand the test of time."] },
        artDeVivre: { title: "Art de vivre", caption: ["A certain idea", "of the beautiful and the good."] },
        international: { title: "International", caption: ["Here today,", "elsewhere tomorrow."] },
      },
    },
    newTab: "(opens in a new tab)",
  },
  housesPage: {
    hero: {
      label: "Our houses",
      title: "Three houses, one art of living.",
      intro: "Groupe Balzac brings together complementary activities around a single conviction.",
      imageAlt: "A Balzac Café cup, an antique chest and a stone house in the snow",
    },
    contactCta: "Get in touch",
    cafe: {
      paragraphs: [
        "Bookshop, gallery, café: Balzac Café gathers under one roof what gives a French house its charm. A place to read, to look, to taste and to take one’s time.",
        "Books and posters sit alongside fine wines, cinema and literature. Every visit is an invitation to meet and to talk.",
        "A place of culture, encounters and the art of living, made to be shared.",
      ],
      details: {
        title: "In the house",
        items: ["Bookshop", "Gallery", "Café", "Fine wines", "Cinema and literature"],
      },
    },
    antiques: {
      paragraphs: [
        "Balzac Antiques brings together furniture, works of art and collections chosen for their character and for the stories they tell.",
        "Each piece carries the mark of an era and of a craft. It finds its place in exceptional interiors, where heritage becomes part of everyday life.",
      ],
      details: {
        title: "The selection",
        items: ["Furniture", "Works of art", "Collections"],
      },
    },
    immobilier: {
      paragraphs: [
        "Specialists in the Pontarlier region, Balzac Immobilier is devoted to property of character, to places with a soul.",
        "We offer complete guidance, from the first search to the signing, with the care every project deserves.",
      ],
      details: {
        title: "Our guidance",
        items: ["Search", "Guidance", "Signing", "Pontarlier region"],
      },
    },
  },
  visionPage: {
    hero: {
      label: "Our vision",
      title: "A single conviction.",
      intro: "What connects our houses, from one place to the next.",
      imageAlt: "A Balzac book, a marble bust and an olive branch in a vase on a mantelpiece",
    },
    statement: {
      label: "Groupe Balzac",
      paragraphs: [
        "Beauty, culture and heritage create lasting bonds between people and places. This conviction is what connects each of our houses.",
        "We choose objects and places that stand the test of time, so that they can live on and be passed on in turn.",
        "A certain idea of the beautiful and the good shapes the way we welcome, choose and guide.",
        "Present in France, in Switzerland and around the world, this art of living is made to travel: here today, elsewhere tomorrow.",
      ],
    },
    pillars: {
      label: "Our pillars",
      title: "Four ideas that guide us.",
      body: {
        culture: "Culture sits at the heart of each house: a place for sharing, curiosity and conversation.",
        heritage: "We choose them for their character and take care to pass them on.",
        artDeVivre: "It lives in a cup of coffee, an antique piece of furniture or a stone house.",
        international: "Balzac Café is set to open in other countries through its international franchise.",
      },
    },
    closing: {
      label: "Continue",
      title: "Share this vision.",
      body: "Open a Balzac Café in your country, or simply write to us.",
      franchiseCta: "Discover the franchise",
      contactCta: "Contact us",
    },
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
