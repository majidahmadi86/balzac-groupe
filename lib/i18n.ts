export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const pageKeys = ["home", "about", "vision", "franchise", "news", "contact", "legal", "privacy"] as const;
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
  heroLeadCore: "Nous créons et développons des lieux et des objets qui ont une âme, en France, en Suisse et à l’international.",
  nav: {
    home: "Accueil",
    about: "À propos",
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
    about: { title: "À propos", eyebrow: "Groupe Balzac" },
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
    bands: {
      cafe: {
        label: "Balzac Café",
        title: "Une maison française contemporaine.",
        body: ["Librairie, galerie, café.", "Un lieu de culture, de rencontres et d’art de vivre."],
        cta: "Découvrir Balzac Café",
        imageAlt: "Salle de Balzac Café : clients attablés, tableau des boissons et vitrine de pâtisseries",
      },
      antiques: {
        label: "Balzac Antiques",
        title: "Des objets ayant une histoire.",
        body: ["Mobilier, objets d’art, collections.", "Pour des intérieurs d’exception."],
        cta: "Découvrir Balzac Antiques",
        imageAlt: "Livre ancien de Jules Verne, montre vintage et malle de voyage sur une table de marbre",
      },
      immobilier: {
        label: "Balzac Immobilier",
        title: "L’immobilier de caractère aux portes de la Suisse.",
        body: ["Spécialiste de la région de Pontarlier.", "Un accompagnement complet, de la recherche à la signature."],
        cta: "Découvrir Balzac Immobilier",
        imageAlt: "Ferme de caractère en pierre sous la neige, fenêtres éclairées au coucher du soleil",
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
  aboutPage: {
    hero: {
      label: "À propos",
      title: "Qui nous sommes.",
      intro: "Groupe Balzac crée et développe des lieux et des objets qui ont une âme, en France, en Suisse et à l’international.",
      imageAlt: "Salle de Balzac Café : clients attablés, tableau des boissons et vitrine de pâtisseries",
    },
    group: {
      label: "Groupe Balzac",
      title: "Des lieux, des objets, des histoires.",
      paragraphs: [
        "Groupe Balzac réunit des activités complémentaires autour d’une même conviction : la beauté, la culture et le patrimoine créent des liens durables entre les hommes et les lieux.",
        "Chacune de nos maisons porte cette conviction à sa manière : un lieu où l’on se retrouve, des objets que l’on transmet, un art de vivre que l’on partage.",
      ],
    },
    chapters: {
      cafe: {
        label: "Un lieu · Balzac Café",
        title: "Un lieu où l’on prend le temps.",
        imageAlt: "Façade de Balzac Café, librairie, galerie et café, avec sa terrasse",
        paragraphs: [
          "Librairie, galerie, café : Balzac Café réunit sous un même toit ce qui fait le charme d’une maison française. Un lieu où l’on vient lire, regarder, goûter et prendre le temps.",
          "Les livres et les affiches y côtoient les vins fins, le cinéma et la littérature. Chaque visite est une invitation à la rencontre et à la conversation.",
        ],
      },
      antiques: {
        label: "Des objets · Balzac Antiques",
        title: "Des objets qui traversent le temps.",
        paragraphs: [
          "Balzac Antiques rassemble du mobilier, des objets d’art et des collections choisis pour leur caractère et pour ce qu’ils racontent.",
          "Chaque pièce porte la trace d’une époque et d’un savoir-faire. Elle trouve sa place dans des intérieurs d’exception, où le patrimoine se vit au quotidien.",
        ],
        link: "Découvrir Balzac Antiques",
      },
      immobilier: {
        label: "Des maisons · Balzac Immobilier",
        title: "Des maisons qui ont une âme.",
        paragraphs: [
          "Spécialiste de la région de Pontarlier, Balzac Immobilier se consacre à l’immobilier de caractère, à ces lieux qui ont une âme.",
          "Un accompagnement complet, de la recherche à la signature, avec l’attention que mérite chaque projet.",
        ],
      },
    },
    horizons: {
      label: "Nos horizons",
      title: "D’ici, et d’ailleurs.",
      intro: "Groupe Balzac est présent en France, en Suisse et à l’international, avec le même goût pour ce qui dure.",
      places: [
        { title: "France", body: "L’esprit d’une maison française : ses livres, sa table, ses objets." },
        { title: "Suisse", body: "Un ancrage où se cultive le même attachement au patrimoine et au caractère des lieux." },
        { title: "International", body: "Balzac Café a vocation à voyager, porté par sa franchise internationale." },
      ],
    },
    closing: {
      label: "Notre vision",
      cta: "Découvrir notre vision",
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
  franchisePage: {
    hero: {
      label: "Franchise",
      title: "Une maison française, dans votre ville.",
      intro: "Balzac Café s’ouvre à des partenaires qui partagent son goût pour la culture et l’art de vivre.",
      imageAlt: "Globe ancien et pile de livres marqués Paris, Bangkok, New York, Tokyo",
    },
    proposition: {
      label: "Franchise internationale",
      paragraphs: [
        "Rejoignez l’aventure et développez une maison française dans votre ville.",
        "Balzac Café a vocation à voyager. La franchise permet de faire vivre, ailleurs, un lieu de culture, de rencontres et d’art de vivre, fidèle à l’esprit de la maison.",
      ],
    },
    concept: {
      label: "Le concept",
      details: {
        title: "Dans la maison",
        items: ["Librairie", "Galerie", "Café", "Vins fins", "Cinéma et littérature"],
      },
      paragraphs: [
        "Librairie, galerie, café : Balzac Café réunit sous un même toit les livres, les images et le goût d’une maison française.",
        "Un lieu où l’on vient lire, regarder, goûter et prendre le temps, pensé pour devenir un repère dans sa ville.",
      ],
    },
    profile: {
      label: "Le partenaire",
      title: "Un projet porté par des passionnés.",
      intro: "La franchise Balzac Café s’adresse à celles et ceux qui se reconnaissent dans ces quelques traits.",
      traits: [
        { title: "Le goût de la culture", body: "Les livres, les images et la conversation font partie de votre quotidien." },
        { title: "Le sens de l’accueil", body: "Vous aimez recevoir et faire d’un lieu un endroit où l’on revient." },
        { title: "Un ancrage local", body: "Vous connaissez votre ville et ce qui peut y prendre sens." },
        { title: "L’envie d’entreprendre", body: "Vous souhaitez porter un projet durable, fidèle à l’esprit d’une maison." },
      ],
    },
    steps: {
      label: "Le parcours",
      title: "Du premier échange à l’ouverture.",
      items: [
        { title: "Premier contact", body: "Vous nous présentez votre projet et votre ville grâce au formulaire de cette page." },
        { title: "Rencontre", body: "Nous faisons connaissance et vous présentons le concept Balzac Café." },
        { title: "Étude du projet", body: "Ensemble, nous examinons le lieu, la ville et la manière d’y faire vivre la maison." },
        { title: "Ouverture", body: "Nous vous accompagnons dans la préparation de l’ouverture de votre Balzac Café." },
      ],
    },
    form: {
      label: "Manifester votre intérêt",
      intro: "Quelques mots suffisent pour commencer. Nous vous répondrons par email.",
    },
  },
  contactPage: {
    hero: {
      label: "Contact",
      title: "Écrivez-nous.",
      intro: "Une question, un projet, une rencontre : nous lisons chaque message.",
      imageAlt: "Livre Balzac, buste en marbre et vase d’olivier sur une cheminée",
    },
    intro: {
      title: "Une question, un projet, une rencontre.",
      body: "Nous lisons chaque message et vous répondons par email.",
    },
    form: {
      label: "Votre message",
    },
    aside: {
      label: "Groupe Balzac",
      maisonsTitle: "Nos maisons",
      cafeNote: "À propos",
      antiquesNote: "balzacantiques.ch",
      immobilierNote: "À propos",
    },
  },
  forms: {
    required: "Tous les champs sont obligatoires.",
    fields: {
      name: "Nom",
      email: "Adresse email",
      location: "Ville et pays",
      subject: "Objet",
      message: "Message",
    },
    hints: {
      location: "Par exemple : Lyon, France",
    },
    submit: {
      contact: "Envoyer le message",
      franchise: "Envoyer ma demande",
    },
    submitting: "Envoi en cours…",
    errors: {
      required: "Ce champ est obligatoire.",
      email: "Saisissez une adresse email valide.",
      tooShort: "Un peu plus de détails, s’il vous plaît.",
      tooLong: "Ce texte est trop long.",
    },
    invalid: "Merci de vérifier les champs signalés.",
    success: {
      contact: { title: "Merci, votre message est bien parti.", body: "Nous vous répondrons à l’adresse" },
      franchise: { title: "Merci pour votre intérêt.", body: "Nous étudions chaque demande et vous répondrons à l’adresse" },
      again: "Envoyer un autre message",
    },
    failure: {
      title: "Votre message n’a pas pu être envoyé.",
      body: "Rien n’est perdu, votre texte est conservé ci-dessous. Merci de réessayer dans un instant.",
      retry: "Réessayer",
    },
    limited: {
      title: "Trop d’envois en peu de temps.",
      body: "Votre texte est conservé ci-dessous. Merci de réessayer dans quelques minutes.",
    },
    captcha: "Une vérification rapide avant l’envoi.",
    stale: {
      title: "Cette page doit être actualisée.",
      body: "Le site a été mis à jour pendant votre saisie. Actualisez la page : votre texte sera conservé.",
      action: "Actualiser la page",
    },
    honeypot: "Ne pas remplir ce champ",
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
  heroLeadCore: "We create and develop places and objects with a soul, in France, in Switzerland and around the world.",
  nav: {
    home: "Home",
    about: "About us",
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
    about: { title: "About us", eyebrow: "Groupe Balzac" },
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
    bands: {
      cafe: {
        label: "Balzac Café",
        title: "A contemporary French house.",
        body: ["Bookshop, gallery, café.", "A place for culture, encounters and the art of living."],
        cta: "Discover Balzac Café",
        imageAlt: "Inside Balzac Café: guests at their tables, the drinks board and a pastry counter",
      },
      antiques: {
        label: "Balzac Antiques",
        title: "Objects with a story.",
        body: ["Furniture, works of art, collections.", "For exceptional interiors."],
        cta: "Discover Balzac Antiques",
        imageAlt: "An antique Jules Verne book, a vintage watch and a travel trunk on a marble table",
      },
      immobilier: {
        label: "Balzac Immobilier",
        title: "Property of character at the gateway to Switzerland.",
        body: ["Specialists in the Pontarlier region.", "Complete guidance, from the first search to the signing."],
        cta: "Discover Balzac Immobilier",
        imageAlt: "A stone farmhouse of character in the snow, its windows lit at sunset",
      },
    },
    franchise: {
      label: "International franchise",
      title: "Open a Balzac Café in your country.",
      body: ["Join the adventure and bring a French house to your city."],
      cta: "Discover the franchise",
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
  aboutPage: {
    hero: {
      label: "About us",
      title: "Who we are.",
      intro: "Groupe Balzac creates and develops places and objects with a soul, in France, in Switzerland and around the world.",
      imageAlt: "Inside Balzac Café: guests at their tables, the drinks board and a pastry counter",
    },
    group: {
      label: "Groupe Balzac",
      title: "Places, objects, stories.",
      paragraphs: [
        "Groupe Balzac brings together complementary activities around a single conviction: beauty, culture and heritage create lasting bonds between people and places.",
        "Each of our houses carries that conviction in its own way: a place where people meet, objects that are passed on, an art of living that is shared.",
      ],
    },
    chapters: {
      cafe: {
        label: "A place · Balzac Café",
        title: "A place to take one’s time.",
        imageAlt: "The Balzac Café storefront, bookshop, gallery and café, with its terrace",
        paragraphs: [
          "Bookshop, gallery, café: Balzac Café gathers under one roof what gives a French house its charm. A place to read, to look, to taste and to take one’s time.",
          "Books and posters sit alongside fine wines, cinema and literature. Every visit is an invitation to meet and to talk.",
        ],
      },
      antiques: {
        label: "Objects · Balzac Antiques",
        title: "Objects that stand the test of time.",
        paragraphs: [
          "Balzac Antiques brings together furniture, works of art and collections chosen for their character and for the stories they tell.",
          "Each piece carries the mark of an era and of a craft. It finds its place in exceptional interiors, where heritage becomes part of everyday life.",
        ],
        link: "Discover Balzac Antiques",
      },
      immobilier: {
        label: "Houses · Balzac Immobilier",
        title: "Houses with a soul.",
        paragraphs: [
          "Specialists in the Pontarlier region, Balzac Immobilier is devoted to property of character, to places with a soul.",
          "Complete guidance, from the first search to the signing, with the care every project deserves.",
        ],
      },
    },
    horizons: {
      label: "Our horizons",
      title: "Here, and elsewhere.",
      intro: "Groupe Balzac is present in France, in Switzerland and around the world, with the same taste for what lasts.",
      places: [
        { title: "France", body: "The spirit of a French house: its books, its table, its objects." },
        { title: "Switzerland", body: "Roots where the same attachment to heritage and to the character of places is cultivated." },
        { title: "International", body: "Balzac Café is made to travel, carried by its international franchise." },
      ],
    },
    closing: {
      label: "Our vision",
      cta: "Discover our vision",
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
  franchisePage: {
    hero: {
      label: "Franchise",
      title: "A French house, in your city.",
      intro: "Balzac Café is opening to partners who share its taste for culture and the art of living.",
      imageAlt: "An antique globe beside books marked Paris, Bangkok, New York, Tokyo",
    },
    proposition: {
      label: "International franchise",
      paragraphs: [
        "Join the adventure and bring a French house to your city.",
        "Balzac Café is made to travel. The franchise brings a place of culture, encounters and the art of living to new cities, true to the spirit of the house.",
      ],
    },
    concept: {
      label: "The concept",
      details: {
        title: "In the house",
        items: ["Bookshop", "Gallery", "Café", "Fine wines", "Cinema and literature"],
      },
      paragraphs: [
        "Bookshop, gallery, café: Balzac Café gathers under one roof books, images and the pleasures of a French house.",
        "A place to read, to look, to taste and to take one’s time, designed to become a landmark in its city.",
      ],
    },
    profile: {
      label: "The partner",
      title: "A project carried by people who care.",
      intro: "The Balzac Café franchise is for those who recognise themselves in a few simple traits.",
      traits: [
        { title: "A taste for culture", body: "Books, images and conversation are part of your everyday life." },
        { title: "A sense of welcome", body: "You love to receive guests and make a place somewhere people return to." },
        { title: "Local roots", body: "You know your city and what can take on meaning there." },
        { title: "The wish to build", body: "You want to carry a lasting project, true to the spirit of a house." },
      ],
    },
    steps: {
      label: "The path",
      title: "From first conversation to opening.",
      items: [
        { title: "First contact", body: "Tell us about your project and your city through the form on this page." },
        { title: "Meeting", body: "We get to know each other and introduce you to the Balzac Café concept." },
        { title: "Project study", body: "Together we look at the premises, the city and how the house can live there." },
        { title: "Opening", body: "We support you as you prepare to open your Balzac Café." },
      ],
    },
    form: {
      label: "Express your interest",
      intro: "A few words are enough to begin. We will reply by email.",
    },
  },
  contactPage: {
    hero: {
      label: "Contact",
      title: "Write to us.",
      intro: "A question, a project, a meeting: we read every message.",
      imageAlt: "A Balzac book, a marble bust and an olive branch in a vase on a mantelpiece",
    },
    intro: {
      title: "A question, a project, a meeting.",
      body: "We read every message and reply by email.",
    },
    form: {
      label: "Your message",
    },
    aside: {
      label: "Groupe Balzac",
      maisonsTitle: "Our houses",
      cafeNote: "About us",
      antiquesNote: "balzacantiques.ch",
      immobilierNote: "About us",
    },
  },
  forms: {
    required: "All fields are required.",
    fields: {
      name: "Name",
      email: "Email address",
      location: "City and country",
      subject: "Subject",
      message: "Message",
    },
    hints: {
      location: "For example: Lyon, France",
    },
    submit: {
      contact: "Send message",
      franchise: "Send my enquiry",
    },
    submitting: "Sending…",
    errors: {
      required: "This field is required.",
      email: "Enter a valid email address.",
      tooShort: "A little more detail, please.",
      tooLong: "This text is too long.",
    },
    invalid: "Please check the highlighted fields.",
    success: {
      contact: { title: "Thank you, your message is on its way.", body: "We will reply to" },
      franchise: { title: "Thank you for your interest.", body: "We review every enquiry and will reply to" },
      again: "Send another message",
    },
    failure: {
      title: "Your message could not be sent.",
      body: "Nothing is lost, your text is kept below. Please try again in a moment.",
      retry: "Try again",
    },
    limited: {
      title: "Too many messages in a short time.",
      body: "Your text is kept below. Please try again in a few minutes.",
    },
    captcha: "A quick check before sending.",
    stale: {
      title: "This page needs refreshing.",
      body: "The site was updated while you were writing. Refresh the page and your text will be kept.",
      action: "Refresh the page",
    },
    honeypot: "Leave this field empty",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
