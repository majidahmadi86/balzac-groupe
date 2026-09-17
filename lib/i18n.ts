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
    activities: {
      label: "Nos activités",
      title: "Trois domaines complémentaires, réunis par la culture, le caractère et l’art de vivre à la française.",
    },
    bands: {
      cafe: {
        field: "Gestion hôtelière",
        name: "Balzac Café",
        title: "Balzac Café & French Cultural Corner",
        body: [
          "Nous créons et gérons des cafés où l’hospitalité rencontre la culture française, à travers les livres, l’art, la musique, le cinéma et la conversation.",
        ],
        cta: "Découvrir Balzac Café",
        imageAlt: "Salle de Balzac Café : clients attablés, tableau des boissons et vitrine de pâtisseries",
      },
      antiques: {
        field: "Patrimoine",
        name: "Balzac Antiques",
        title: "Balzac Antiques",
        body: [
          "Nous achetons et vendons livres rares, objets culturels, œuvres d’art, montres, mode vintage et pièces iconiques, choisis pour leur histoire et leur caractère.",
        ],
        cta: "Découvrir Balzac Antiques",
        imageAlt: "Livre ancien de Jules Verne, montre vintage et malle de voyage sur une table de marbre",
      },
      immobilier: {
        field: "Immobilier",
        name: "Balzac Immobilier",
        title: "Balzac Immobilier",
        body: [
          "Des biens de caractère situés en France, près de la frontière suisse, avec un accompagnement personnalisé pour celles et ceux qui cherchent une maison singulière dans la région.",
        ],
        cta: "Découvrir Balzac Immobilier",
        imageAlt: "Ferme de caractère en pierre sous la neige, fenêtres éclairées au coucher du soleil",
      },
    },
    franchise: {
      label: "Franchise internationale",
      title: "Ouvrez Balzac Café dans votre pays.",
      body: ["Rejoignez l’aventure et développez une maison française dans votre ville."],
      cta: "En savoir plus",
      imageAlt: "Une personne, un livre à la main, devant la façade de Balzac Café et sa terrasse",
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
      title: "Trois activités. Une identité.",
      intro: "Groupe Balzac est un groupe indépendant actif dans trois domaines complémentaires : la gestion hôtelière, le patrimoine et l’immobilier.",
      imageAlt: "Salle de Balzac Café : clients attablés, tableau des boissons et vitrine de pâtisseries",
    },
    identity: {
      label: "Groupe Balzac",
      paragraphs: [
        "Ses projets sont de nature différente, mais ils partagent la même identité : un lien fort avec la culture française, un goût pour le caractère et l’histoire, et une approche personnelle de chaque lieu, de chaque objet et de chaque bien.",
        "Groupe Balzac a été créé et est dirigé par Chango Zaza Favre, entrepreneur suisse attaché de longue date à la France et passionné de littérature, de culture et d’art de vivre français.",
        "Son expérience du développement de projets culturels et commerciaux entre l’Europe et l’Asie a façonné l’approche indépendante, internationale et personnelle du groupe.",
      ],
    },
    chapters: {
      cafe: {
        label: "Gestion hôtelière · Balzac Café",
        title: "Un coin de culture française.",
        imageAlt: "Façade de Balzac Café, librairie, galerie et café, avec sa terrasse",
        paragraphs: [
          "Balzac Café est plus qu’un café. C’est une destination culturelle où les livres, l’art, la musique, le cinéma, la table et la conversation se rejoignent.",
          "Créé à Bangkok, Balzac Café propose une expérience originale de la culture française dans un cadre chaleureux et singulier. On y découvre des livres, des expositions, des films, de la musique, des objets choisis avec soin et un café inspiré de l’art de vivre à la française.",
          "Groupe Balzac développe et gère le concept avec une attention particulière à l’identité, à l’atmosphère et à la programmation culturelle. Balzac Café est aussi pensé pour un développement international, par des partenariats choisis avec soin.",
        ],
      },
      antiques: {
        label: "Patrimoine · Balzac Antiques",
        title: "Des objets qui ont une histoire et du caractère.",
        paragraphs: [
          "Balzac Antiques achète et vend des livres rares, des objets culturels, des œuvres d’art, des montres, de la mode vintage, des pièces de design et des objets iconiques.",
          "Notre sélection ne se limite ni à une époque ni à une catégorie. Nous cherchons des pièces qui portent une histoire, qui reflètent une époque ou qui incarnent le style et la créativité de leur temps.",
          "Chaque objet est choisi pour son authenticité, son caractère, son intérêt culturel et sa valeur durable. Balzac Antiques relie collectionneurs, amateurs et clients en quête de pièces singulières qui méritent d’être découvertes, préservées et transmises.",
        ],
        link: "Découvrir Balzac Antiques",
      },
      immobilier: {
        label: "Immobilier · Balzac Immobilier",
        title: "Des biens de caractère près de la frontière suisse.",
        paragraphs: [
          "Balzac Immobilier est spécialisé dans les biens singuliers situés en France, à proximité de la frontière suisse.",
          "Nous nous concentrons sur des maisons, des appartements, des fermes rénovées et d’autres biens choisis pour leur architecture, leur authenticité, leur cadre et leur qualité de vie.",
          "Nous offrons un accompagnement personnalisé tout au long du parcours, de la recherche et de la sélection des biens à la négociation et à la signature. Une attention particulière est portée aux clients internationaux et frontaliers, qui attendent un soutien clair, fiable et attentif pour acheter en France.",
        ],
      },
    },
    approach: {
      label: "Notre approche",
      title: "Indépendante, personnelle et sélective.",
      paragraphs: [
        "Groupe Balzac préfère le caractère à l’uniformité, la relation personnelle au volume, et la valeur durable aux tendances passagères.",
        "Qu’il s’agisse de gérer un café culturel, de choisir un objet rare ou de présenter un bien singulier, le groupe suit le même principe : chaque projet doit avoir une identité claire, une histoire qui a du sens et une vraie raison d’être.",
        "Cette vision indépendante permet à chaque activité Balzac de se développer à sa manière, tout en restant partie d’un ensemble cohérent et reconnaissable.",
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
      title: "Trois domaines. Une direction.",
      intro: "Groupe Balzac développe trois activités complémentaires : la gestion hôtelière, le patrimoine et l’immobilier.",
      imageAlt: "Livre Balzac, buste en marbre et vase d’olivier sur une cheminée",
    },
    statement: {
      label: "Groupe Balzac",
      paragraphs: [
        "Chacune a sa raison d’être, mais toutes partagent le même engagement : la culture française, une identité forte, une sélection exigeante et un service personnel.",
      ],
    },
    fields: {
      hospitality: {
        label: "Gestion hôtelière",
        title: "Créer des destinations culturelles.",
        paragraphs: [
          "Notre vision de Balzac Café est de créer bien plus qu’un lieu où boire et manger. Chaque café est conçu comme un French Cultural Corner, où les livres, l’art, la musique, le cinéma, la table et la conversation se rejoignent.",
          "Par une gestion attentive, des intérieurs singuliers et une programmation culturelle, Balzac Café offre une expérience reconnaissable, inspirée de la culture française et de l’art de vivre.",
          "Le concept est pensé pour un développement international, avec des partenaires de franchise choisis avec soin, qui en comprennent l’identité et en respectent la dimension culturelle.",
        ],
      },
      heritage: {
        label: "Patrimoine",
        title: "Chercher, acheter et transmettre des objets qui ont une histoire.",
        paragraphs: [
          "Balzac Antiques recherche et achète activement des livres rares, des objets culturels, des œuvres d’art, des montres, de la mode vintage, des pièces de design et des objets iconiques.",
          "Nous achetons aussi bien des pièces isolées que des collections entières, auprès de particuliers, de collectionneurs et de professionnels. Chaque pièce est choisie pour son authenticité, son histoire, son intérêt culturel et son caractère.",
          "Notre rôle est de relier ces objets à de nouveaux collectionneurs et propriétaires, qui sauront les apprécier, les préserver et poursuivre leur histoire.",
        ],
      },
      realEstate: {
        label: "Immobilier",
        title: "Relier les personnes aux biens de caractère.",
        paragraphs: [
          "Balzac Immobilier est spécialisé dans les biens singuliers situés en France, près de la frontière suisse.",
          "Nous nous concentrons sur des maisons, des appartements, des fermes rénovées et d’autres biens choisis pour leur architecture, leur authenticité, leur cadre et leur qualité de vie.",
          "Notre vision est d’offrir une approche personnelle et sélective, avec un accompagnement clair et attentif tout au long du parcours, en particulier pour les clients internationaux et frontaliers qui souhaitent acheter une maison en France.",
        ],
      },
    },
    horizons: {
      label: "Nos horizons",
      title: "Une idée intemporelle de la France.",
      paragraphs: [
        "La France continue d’inspirer le monde par son art de vivre, mais aussi par ses écrivains, ses peintres, ses philosophes, ses cafés littéraires et ses voix inoubliables.",
        "Groupe Balzac fait vivre cet héritage culturel au présent et le partage avec une nouvelle génération.",
        "Dans un monde qui va toujours plus vite, nous offrons un endroit où faire une pause : ouvrir un livre, découvrir un artiste, savourer un café et avoir une vraie conversation. La technologie nous relie, mais certaines expériences méritent du temps, de l’attention et une présence humaine.",
        "Notre approche ne consiste pas à regarder en arrière. Elle consiste à donner aux idées intemporelles une place dans la vie contemporaine.",
        "Près de 90 % de nos hôtes sont jeunes. Leur enthousiasme montre que la littérature, la culture et les rencontres qui comptent ont encore le pouvoir de réunir les générations et les cultures.",
        "C’est l’horizon auquel nous croyons : un monde plus curieux, plus ouvert et plus humain.",
      ],
    },
    commitment: {
      label: "Notre engagement",
      title: "Trois activités. Une exigence.",
      paragraphs: [
        "En gestion hôtelière, en patrimoine et en immobilier, Groupe Balzac préfère la qualité au volume, le caractère à l’uniformité et les relations durables aux transactions passagères.",
        "Chaque café, chaque objet et chaque bien est abordé avec curiosité, discernement et respect de ce qui le rend singulier.",
      ],
    },
    closing: {
      title: "Découvrir Groupe Balzac",
      body: "Découvrez Balzac Café, Balzac Antiques et Balzac Immobilier, ou écrivez-nous pour parler d’un projet, d’un objet, d’un bien ou d’un partenariat.",
      activitiesCta: "Découvrir nos activités",
      contactCta: "Nous contacter",
    },
  },
  franchisePage: {
    hero: {
      label: "Franchise",
      title: "Une maison française, dans votre ville.",
      intro: "Balzac Café s’ouvre à des partenaires qui partagent son goût pour la culture et l’art de vivre.",
      imageAlt: "Une personne, un livre à la main, devant la façade de Balzac Café et sa terrasse",
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
      title: "Un café culturel français.",
      details: {
        title: "Dans la maison",
        items: ["Librairie", "Galerie", "Café", "Vins fins", "Cinéma et littérature"],
      },
      paragraphs: [
        "Balzac Café est un concept singulier, créé pour des entrepreneurs qui partagent un intérêt à la fois pour l’hospitalité et pour la culture.",
        "Plus qu’un café traditionnel, il réunit la culture française, l’art de vivre et un fort sentiment du lieu, dans un concept pensé pour un développement international.",
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
    activities: {
      label: "Our activities",
      title: "Three complementary fields, united by culture, character and the French art of living.",
    },
    bands: {
      cafe: {
        field: "Hospitality management",
        name: "Balzac Café",
        title: "Balzac Café & French Cultural Corner",
        body: [
          "We create and manage cafés where hospitality meets French culture through books, art, music, cinema and conversation.",
        ],
        cta: "Discover Balzac Café",
        imageAlt: "Inside Balzac Café: guests at their tables, the drinks board and a pastry counter",
      },
      antiques: {
        field: "Heritage",
        name: "Balzac Antiques",
        title: "Balzac Antiques",
        body: [
          "We buy and sell rare books, cultural objects, art, watches, vintage fashion and iconic pieces selected for their history and character.",
        ],
        cta: "Discover Balzac Antiques",
        imageAlt: "An antique Jules Verne book, a vintage watch and a travel trunk on a marble table",
      },
      immobilier: {
        field: "Real estate",
        name: "Balzac Immobilier",
        title: "Balzac Immobilier",
        body: [
          "Properties with character located in France, near the Swiss border, with personalised guidance for clients seeking a distinctive home in the region.",
        ],
        cta: "Discover Balzac Immobilier",
        imageAlt: "A stone farmhouse of character in the snow, its windows lit at sunset",
      },
    },
    franchise: {
      label: "International franchise",
      title: "Open a Balzac Café in your country.",
      body: ["Join the adventure and bring a French house to your city."],
      cta: "Discover the franchise",
      imageAlt: "Someone holding a book outside the Balzac Café storefront and its terrace",
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
      title: "Three activities. One identity.",
      intro: "Groupe Balzac is an independent group active in three complementary fields: hospitality management, heritage and real estate.",
      imageAlt: "Inside Balzac Café: guests at their tables, the drinks board and a pastry counter",
    },
    identity: {
      label: "Groupe Balzac",
      paragraphs: [
        "Its projects are different in nature, yet they share the same identity: a strong connection to French culture, an appreciation for character and history, and a personal approach to every place, object and property.",
        "Groupe Balzac was created and is managed by Chango Zaza Favre, a Swiss entrepreneur with a longstanding connection to France and a passion for French literature, culture and art de vivre.",
        "His experience developing cultural and commercial projects between Europe and Asia has shaped the group’s independent, international and personal approach.",
      ],
    },
    chapters: {
      cafe: {
        label: "Hospitality management · Balzac Café",
        title: "A French cultural corner.",
        imageAlt: "The Balzac Café storefront, bookshop, gallery and café, with its terrace",
        paragraphs: [
          "Balzac Café is more than a café. It is a cultural destination where books, art, music, cinema, food and conversation come together.",
          "Created in Bangkok, Balzac Café offers an original experience of French culture in a warm and distinctive setting. Visitors can discover books, exhibitions, films, music, carefully selected objects and a café inspired by the French art of living.",
          "Groupe Balzac develops and manages the concept with particular attention to identity, atmosphere and cultural programming. Balzac Café is also designed for international development through carefully selected partnerships.",
        ],
      },
      antiques: {
        label: "Heritage · Balzac Antiques",
        title: "Objects with history and character.",
        paragraphs: [
          "Balzac Antiques buys and sells rare books, cultural objects, art, watches, vintage fashion, design pieces and iconic objects.",
          "Our selection is not limited to a single period or category. We look for pieces that carry a story, reflect a particular era or embody the style and creativity of their time.",
          "Each object is selected for its authenticity, character, cultural interest and lasting appeal. Balzac Antiques connects collectors, enthusiasts and clients looking for singular pieces that deserve to be discovered, preserved and passed on.",
        ],
        link: "Discover Balzac Antiques",
      },
      immobilier: {
        label: "Real estate · Balzac Immobilier",
        title: "Properties with character near the Swiss border.",
        paragraphs: [
          "Balzac Immobilier specialises in distinctive properties located in France, close to the Swiss border.",
          "Our focus is on houses, apartments, renovated farmhouses and other properties chosen for their architecture, authenticity, setting and quality of life.",
          "We offer personalised guidance throughout the process, from the initial search and selection of properties to negotiations and completion. Particular attention is given to international and cross-border clients who require clear, reliable and attentive support when purchasing property in France.",
        ],
      },
    },
    approach: {
      label: "Our approach",
      title: "Independent, personal and selective.",
      paragraphs: [
        "Groupe Balzac favours character over uniformity, personal relationships over volume and lasting value over passing trends.",
        "Whether managing a cultural café, selecting a rare object or presenting a distinctive property, the group follows the same principle: every project must have a clear identity, a meaningful story and a genuine reason to exist.",
        "This independent vision allows each Balzac activity to develop in its own way while remaining part of a coherent and recognisable whole.",
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
      title: "Three fields. One direction.",
      intro: "Groupe Balzac develops three complementary activities: hospitality management, heritage and real estate.",
      imageAlt: "A Balzac book, a marble bust and an olive branch in a vase on a mantelpiece",
    },
    statement: {
      label: "Groupe Balzac",
      paragraphs: [
        "Each has its own purpose, but all share the same commitment to French culture, strong identity, careful selection and personal service.",
      ],
    },
    fields: {
      hospitality: {
        label: "Hospitality management",
        title: "Creating cultural destinations.",
        paragraphs: [
          "Our vision for Balzac Café is to create more than a place to eat and drink. Each café is conceived as a French Cultural Corner where books, art, music, cinema, food and conversation come together.",
          "Through thoughtful management, distinctive interiors and cultural programming, Balzac Café offers a recognisable experience inspired by French culture and art de vivre.",
          "The concept is designed for international development through carefully selected franchise partners who understand its identity and respect its cultural dimension.",
        ],
      },
      heritage: {
        label: "Heritage",
        title: "Sourcing, buying and passing on objects with a story.",
        paragraphs: [
          "Balzac Antiques actively searches for and purchases rare books, cultural objects, works of art, watches, vintage fashion, design pieces and iconic objects.",
          "We buy individual pieces as well as complete collections from private owners, collectors and professionals. Each item is selected for its authenticity, history, cultural interest and character.",
          "Our role is to connect these objects with new collectors and owners who will appreciate, preserve and continue their stories.",
        ],
      },
      realEstate: {
        label: "Real estate",
        title: "Connecting people with properties of character.",
        paragraphs: [
          "Balzac Immobilier specialises in distinctive properties located in France, near the Swiss border.",
          "We focus on houses, apartments, renovated farmhouses and other properties selected for their architecture, authenticity, setting and quality of life.",
          "Our vision is to offer a personal and selective approach, with clear and attentive guidance throughout the process, particularly for international and cross-border clients looking to purchase a home in France.",
        ],
      },
    },
    horizons: {
      label: "Our horizons",
      title: "A timeless idea of France.",
      paragraphs: [
        "France continues to inspire the world through its art de vivre, but also through its writers, painters, philosophers, literary cafés and unforgettable voices.",
        "Groupe Balzac brings this cultural heritage into the present and shares it with a new generation.",
        "In a world that moves ever faster, we offer a place to pause: to open a book, discover an artist, enjoy a coffee and have a real conversation. Technology connects us, but certain experiences deserve time, attention and human presence.",
        "Our approach is not about looking back. It is about giving timeless ideas a place in contemporary life.",
        "Nearly 90% of our guests are young. Their enthusiasm shows that literature, culture and meaningful encounters still have the power to bring generations and cultures together.",
        "This is the horizon we believe in: a more curious, more open and more human world.",
      ],
    },
    commitment: {
      label: "Our commitment",
      title: "Three activities. One standard.",
      paragraphs: [
        "Across hospitality management, heritage and real estate, Groupe Balzac favours quality over volume, character over uniformity and lasting relationships over short-term transactions.",
        "Every café, object and property is approached with curiosity, discernment and respect for what makes it distinctive.",
      ],
    },
    closing: {
      title: "Discover Groupe Balzac",
      body: "Explore Balzac Café, Balzac Antiques and Balzac Immobilier, or contact us to discuss a project, an object, a property or a partnership.",
      activitiesCta: "Discover our activities",
      contactCta: "Contact us",
    },
  },
  franchisePage: {
    hero: {
      label: "Franchise",
      title: "A French house, in your city.",
      intro: "Balzac Café is opening to partners who share its taste for culture and the art of living.",
      imageAlt: "Someone holding a book outside the Balzac Café storefront and its terrace",
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
      title: "A French cultural café.",
      details: {
        title: "In the house",
        items: ["Bookshop", "Gallery", "Café", "Fine wines", "Cinema and literature"],
      },
      paragraphs: [
        "Balzac Café is a distinctive concept created for entrepreneurs who share an interest in both hospitality and culture.",
        "More than a traditional café, it brings together French culture, art de vivre and a strong sense of place within a concept designed for international development.",
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
