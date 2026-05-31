import type { App } from "@/types";

export const apps: App[] = [
  {
    id: "earnapp",
    slug: "earnapp",
    name: "EarnApp",
    color: "#AB9FF2",
    description:
      "EarnApp permet de monétiser votre bande passante inutilisée. Installez l'application, laissez-la tourner en arrière-plan et gagnez de l'argent passivement chaque mois.",
    shortDescription: "Partage de bande passante pour des revenus passifs",
    earningsMin: 5,
    earningsMax: 50,
    difficulty: "very-easy",
    difficultyLabel: "Très facile",
    platforms: ["android", "ios", "windows", "linux"],
    categories: ["passive", "bandwidth"],
    downloadLinks: [
      { platform: "signup", label: "Créer un compte", url: "https://earnapp.com/" },
      { platform: "android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.earnapp.earn" },
      { platform: "ios", label: "App Store", url: "https://apps.apple.com/app/earnapp-make-money/id1524366862" },
      { platform: "windows", label: "Windows", url: "https://earnapp.com/download/" },
      { platform: "linux", label: "Linux / macOS", url: "https://earnapp.com/download/" },
    ],
    referralCodes: [],
    referralFaqHint:
      "Entrez le code lors de l'inscription sur earnapp.com, ou utilisez le lien earnapp.com/i/VOTRE_CODE.",
    referralInstructions:
      "EarnApp — lors de l'inscription :\n\n1. Rendez-vous sur earnapp.com et créez un compte.\n2. Si un champ « Referral code » apparaît, collez le code Money's House.\n3. Vous pouvez aussi utiliser un lien parrain : https://earnapp.com/i/VOTRE_CODE\n4. Installez l'application et connectez-vous avec le même compte.\n\nLe code doit être entré avant ou pendant la création du compte.",
    howItWorks:
      "EarnApp utilise votre connexion internet inutilisée pour des requêtes légitimes de recherche web et de vérification de contenu.",
    advantages: [
      "Installation en 2 minutes",
      "Revenus entièrement passifs",
      "Compatible multi-appareils",
      "Paiements via PayPal",
      "Aucune interaction requise",
    ],
    disadvantages: [
      "Revenus modestes selon la connexion",
      "Consommation légère de batterie sur mobile",
      "Non disponible dans certains pays",
    ],
    tutorial: [
      { step: 1, title: "Créer un compte", description: "Inscrivez-vous sur earnapp.com avec votre email." },
      { step: 2, title: "Entrer le code parrain", description: "Utilisez le code Money's House lors de l'inscription." },
      { step: 3, title: "Installer l'application", description: "Téléchargez EarnApp pour votre plateforme." },
      { step: 4, title: "Retirer vos gains", description: "Atteignez 10$ minimum et retirez via PayPal." },
    ],
    faq: [
      { question: "Est-ce sécurisé ?", answer: "Oui, EarnApp ne collecte aucune donnée personnelle et utilise uniquement votre bande passante inutilisée." },
      { question: "Combien puis-je gagner ?", answer: "Entre 5€ et 50€/mois selon votre connexion et le nombre d'appareils connectés." },
    ],
    featured: true,
  },
  {
    id: "honeygain",
    slug: "honeygain",
    name: "Honeygain",
    color: "#4878D8",
    description:
      "Honeygain est l'une des applications les plus populaires pour monétiser votre bande passante.",
    shortDescription: "Monétisez votre bande passante inutilisée",
    earningsMin: 5,
    earningsMax: 40,
    difficulty: "very-easy",
    difficultyLabel: "Très facile",
    platforms: ["android", "ios", "windows", "linux"],
    categories: ["passive", "bandwidth"],
    downloadLinks: [
      { platform: "signup", label: "Créer un compte", url: "https://dashboard.honeygain.com/sign-up" },
      { platform: "web", label: "Dashboard", url: "https://dashboard.honeygain.com/" },
      { platform: "android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.honeygain.make.money" },
      { platform: "ios", label: "App Store", url: "https://apps.apple.com/app/honeygain/id1452720679" },
      { platform: "windows", label: "Windows", url: "https://www.honeygain.com/download" },
      { platform: "linux", label: "Linux / macOS", url: "https://www.honeygain.com/download" },
    ],
    referralCodes: [],
    referralFaqHint:
      "Saisissez le code dans le champ « Referral code » sur dashboard.honeygain.com/sign-up, ou via r.honeygain.com/VOTRECODE.",
    referralInstructions:
      "Honeygain — lors de l'inscription :\n\n1. Allez sur dashboard.honeygain.com/sign-up.\n2. Remplissez email et mot de passe.\n3. Entrez le code Money's House dans le champ « Referral code ».\n4. Alternative : lien parrain https://r.honeygain.com/VOTRECODE\n5. Téléchargez l'app et connectez-vous.\n\nLe code doit être saisi au moment de l'inscription.",
    howItWorks:
      "Honeygain partage votre connexion internet avec des entreprises partenaires. Vous êtes rémunéré pour chaque Mo partagé.",
    advantages: [
      "Interface intuitive",
      "Bonus de parrainage généreux",
      "Dashboard en temps réel",
      "Communauté active",
      "Paiements réguliers",
    ],
    disadvantages: [
      "Minimum de retrait à 20$",
      "Revenus variables selon la région",
      "Peut ralentir légèrement la connexion",
    ],
    tutorial: [
      { step: 1, title: "S'inscrire", description: "Créez votre compte avec le code parrain Money's House." },
      { step: 2, title: "Télécharger l'app", description: "Installez Honeygain sur vos appareils." },
      { step: 3, title: "Activer le partage", description: "Connectez-vous et activez le partage de bande passante." },
    ],
    faq: [
      { question: "Honeygain est-il légal ?", answer: "Oui, Honeygain est une entreprise légitime basée en Lituanie, active depuis 2019." },
    ],
    featured: true,
  },
  {
    id: "mcmoney",
    slug: "mcmoney",
    name: "McMoney",
    color: "#E2DFFE",
    description:
      "McMoney vous rémunère pour recevoir des SMS sur votre téléphone.",
    shortDescription: "Revenus via réception de SMS",
    earningsLabel: "Variables",
    difficulty: "easy",
    difficultyLabel: "Facile",
    platforms: ["android"],
    categories: ["sms", "passive"],
    downloadLinks: [
      { platform: "signup", label: "Site officiel", url: "https://mcmoney.app/" },
      { platform: "android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.textcash.ap" },
    ],
    referralCodes: [],
    referralFaqHint: "Entrez le code à l'inscription dans l'application Android.",
    referralInstructions:
      "McMoney — lors de l'inscription :\n\n1. Téléchargez l'app depuis le Play Store ou mcmoney.app.\n2. Créez un compte dans l'application.\n3. Cherchez « Referral code » ou « Code d'invitation » dans les paramètres ou à l'inscription.\n4. Entrez le code Money's House avant de valider.\n\nLe code doit être entré lors de la première configuration du compte.",
    howItWorks:
      "McMoney envoie des SMS de vérification à votre numéro. Vous recevez une rémunération pour chaque SMS reçu.",
    advantages: ["Revenus par SMS reçu", "Aucune action requise", "Paiements rapides"],
    disadvantages: ["Android uniquement", "Nécessite un numéro dédié", "Revenus imprévisibles"],
    tutorial: [
      { step: 1, title: "Installer McMoney", description: "Téléchargez l'app depuis le Play Store." },
      { step: 2, title: "Entrer le code parrain", description: "Saisissez le code Money's House à l'inscription." },
      { step: 3, title: "Configurer votre numéro", description: "Enregistrez un numéro de téléphone dédié." },
    ],
    faq: [
      { question: "Puis-je utiliser mon numéro principal ?", answer: "Nous recommandons un numéro secondaire pour éviter les interférences." },
    ],
    featured: true,
  },
  {
    id: "money-sms",
    slug: "money-sms",
    name: "Money SMS",
    color: "#3C315B",
    description:
      "Money SMS rémunère les utilisateurs pour la réception de SMS de vérification.",
    shortDescription: "Gagnez en recevant des SMS",
    earningsLabel: "Variables",
    difficulty: "easy",
    difficultyLabel: "Facile",
    platforms: ["android"],
    categories: ["sms"],
    downloadLinks: [
      { platform: "signup", label: "Créer un compte", url: "https://moneysms.net/" },
      { platform: "android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.mooncy.sms" },
    ],
    referralCodes: [],
    referralFaqHint: "Saisissez le code sur moneysms.net lors de la création du compte.",
    referralInstructions:
      "Money SMS — lors de l'inscription :\n\n1. Inscrivez-vous sur moneysms.net.\n2. Lors de la création du compte, un champ « Referral code » est disponible.\n3. Entrez le code Money's House avant de valider.\n4. Téléchargez l'app Android et connectez-vous avec le même compte.\n\nLe code doit être saisi sur le site web avant d'installer l'app.",
    howItWorks:
      "Money SMS utilise votre téléphone comme relais pour recevoir des codes de vérification SMS.",
    advantages: ["Totalement automatisé", "Pas de compétences requises", "Retraits flexibles"],
    disadvantages: ["Android seulement", "Volume de SMS variable", "Revenus modestes"],
    tutorial: [
      { step: 1, title: "Créer un compte", description: "Inscrivez-vous sur moneysms.net avec le code parrain." },
      { step: 2, title: "Installer et configurer", description: "Installez l'app et autorisez la réception de SMS." },
    ],
    faq: [],
    featured: false,
  },
  {
    id: "gamby",
    slug: "gamby",
    name: "Gamby",
    color: "#22C55E",
    description:
      "Gamby est l'application de pronostics sportifs 100 % gratuite qui récompense vos bonnes prédictions. Football, tennis, basket, MMA, eSport… gagnez des Gambz convertibles en argent réel, sans parier ni déposer d'argent.",
    shortDescription: "Pronostics sportifs gratuits rémunérés",
    earningsLabel: "Variables",
    difficulty: "easy",
    difficultyLabel: "Facile",
    platforms: ["android", "ios"],
    categories: ["games", "surveys"],
    downloadLinks: [
      { platform: "signup", label: "Site officiel", url: "https://www.gamby.app/" },
      { platform: "android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.gamby.app" },
      { platform: "ios", label: "App Store", url: "https://apps.apple.com/app/gamby-sports-prediction-game/id6477860898" },
    ],
    referralCodes: [],
    referralFaqHint:
      "Entrez le code parrain lors de l'inscription ou dans la section parrainage de l'application Gamby.",
    referralInstructions:
      "Gamby — lors de l'inscription :\n\n1. Téléchargez Gamby sur le Play Store ou l'App Store.\n2. Créez votre compte avec votre email.\n3. Cherchez « Code parrain » ou « Referral code » dans les paramètres ou à l'inscription.\n4. Entrez le code Money's House avant de valider.\n5. Invitez vos amis pour gagner des Gambz bonus.\n\nLe code parrain peut être saisi à l'inscription ou depuis votre profil.",
    howItWorks:
      "Chaque jour, vous recevez des jetons gratuits pour pronostiquer sur des matchs. Les bonnes réponses rapportent des points et des Gambz. Complétez aussi des sondages et mini-jeux pour augmenter vos gains, puis convertissez vos Gambz en argent réel.",
    advantages: [
      "100 % gratuit, sans pari ni dépôt",
      "Pronostics sur de nombreux sports",
      "Gains convertibles en argent réel",
      "Programme de parrainage",
      "Communauté active sur Discord",
    ],
    disadvantages: [
      "Nécessite une activité régulière (jetons quotidiens)",
      "Revenus variables selon vos pronostics",
      "Retrait sous quelques jours ouvrés",
    ],
    tutorial: [
      { step: 1, title: "Télécharger Gamby", description: "Installez l'app depuis le Play Store ou l'App Store." },
      { step: 2, title: "Entrer le code parrain", description: "Saisissez le code Money's House à l'inscription." },
      { step: 3, title: "Faire vos pronostics", description: "Utilisez vos jetons quotidiens sur les matchs de votre choix." },
      { step: 4, title: "Convertir vos Gambz", description: "Échangez vos Gambz contre de l'argent réel depuis l'app." },
    ],
    faq: [
      {
        question: "Gamby est-il un site de paris ?",
        answer: "Non. Gamby est un jeu de pronostics gratuit. Vous ne pariez jamais votre propre argent.",
      },
      {
        question: "Comment retirer mes gains ?",
        answer: "Accumulez des Gambz via vos pronostics et défis, puis convertissez-les en argent réel depuis l'application. Les paiements sont généralement traités sous 10 jours.",
      },
    ],
    featured: true,
  },
  {
    id: "google-opinion-rewards",
    slug: "google-opinion-rewards",
    name: "Google Opinion Rewards",
    color: "#F5F2FF",
    description:
      "Google Opinion Rewards vous récompense pour répondre à de courts sondages.",
    shortDescription: "Récompenses via sondages Google",
    earningsLabel: "Récompenses Google Play",
    difficulty: "very-easy",
    difficultyLabel: "Très facile",
    platforms: ["android", "ios"],
    categories: ["surveys"],
    downloadLinks: [
      { platform: "android", label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.google.opinionrewards" },
      { platform: "ios", label: "App Store", url: "https://apps.apple.com/app/google-opinion-rewards/id1220212672" },
    ],
    referralCodes: [],
    hasReferral: false,
    referralInstructions:
      "Google Opinion Rewards ne propose pas de programme de parrainage. Vous pouvez télécharger l'application directement depuis le Play Store ou l'App Store sans code.",
    howItWorks:
      "Google vous envoie des sondages courts. Chaque sondage complété vous rapporte des crédits Google Play.",
    advantages: [
      "100% gratuit et officiel Google",
      "Sondages courts (1-2 min)",
      "Crédits Google Play utilisables partout",
    ],
    disadvantages: [
      "Crédits Google Play uniquement",
      "Fréquence de sondages imprévisible",
      "Disponibilité limitée par région",
    ],
    tutorial: [
      { step: 1, title: "Télécharger l'app", description: "Installez depuis le Play Store ou App Store." },
      { step: 2, title: "Activer la localisation", description: "Autorisez la localisation pour plus de sondages." },
    ],
    faq: [
      { question: "Puis-je convertir en argent réel ?", answer: "Non, les récompenses sont en crédits Google Play uniquement." },
    ],
    featured: true,
  },
];

export function getAppBySlug(slug: string): App | undefined {
  return apps.find((app) => app.slug === slug);
}

export function getFeaturedApps(): App[] {
  return apps.filter((app) => app.featured);
}

export function getTopByEarnings(): App[] {
  return [...apps].sort((a, b) => (b.earningsMax ?? 0) - (a.earningsMax ?? 0));
}

export function getEasiestApps(): App[] {
  const order = { "very-easy": 0, easy: 1, medium: 2, hard: 3 };
  return [...apps].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
}
