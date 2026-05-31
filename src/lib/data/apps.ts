import type { App } from "@/types";
import { buildAppLogoUrl, localAppLogo } from "@/lib/app-logos";
import { OFFICIAL_DOWNLOADS } from "@/lib/download-links";

export const apps: App[] = [
  {
    id: "earnapp",
    slug: "earnapp",
    name: "EarnApp",
    color: "#AB9FF2",
    logoUrl: localAppLogo("earnapp.png"),
    description:
      "EarnApp permet de monétiser votre bande passante inutilisée. Installez l'application, laissez-la tourner en arrière-plan et gagnez de l'argent passivement chaque mois.",
    shortDescription: "Partage de bande passante pour des revenus passifs",
    earningsMin: 5,
    earningsMax: 50,
    difficulty: "very-easy",
    difficultyLabel: "Très facile",
    platforms: ["android", "windows", "linux"],
    categories: ["passive", "bandwidth"],
    downloadLinks: [
      { platform: "signup", label: "Créer un compte", url: OFFICIAL_DOWNLOADS.earnapp.signup },
      {
        platform: "android",
        label: "Télécharger Android",
        url: OFFICIAL_DOWNLOADS.earnapp.download,
      },
      { platform: "windows", label: "Windows", url: OFFICIAL_DOWNLOADS.earnapp.download },
      { platform: "linux", label: "Linux / macOS", url: OFFICIAL_DOWNLOADS.earnapp.download },
    ],
    referralCodes: [],
    referralBonusTitle: "Bonus de bienvenue EarnApp",
    referralBonusDescription:
      "Inscrivez-vous avec notre code parrain et débloquez un bonus supplémentaire sur votre compte EarnApp.",
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
      "Application iOS bientôt disponible (earnapp.com)",
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
    logoUrl: buildAppLogoUrl("https://www.honeygain.com"),
    description:
      "Honeygain est l'une des applications les plus populaires pour monétiser votre bande passante.",
    shortDescription: "Monétisez votre bande passante inutilisée",
    earningsMin: 5,
    earningsMax: 40,
    difficulty: "very-easy",
    difficultyLabel: "Très facile",
    platforms: ["android", "windows", "linux"],
    categories: ["passive", "bandwidth"],
    downloadLinks: [
      { platform: "signup", label: "Créer un compte", url: OFFICIAL_DOWNLOADS.honeygain.signup },
      { platform: "web", label: "Dashboard", url: OFFICIAL_DOWNLOADS.honeygain.dashboard },
      {
        platform: "android",
        label: "Télécharger Android (APK)",
        url: OFFICIAL_DOWNLOADS.honeygain.download,
      },
      { platform: "windows", label: "Windows", url: OFFICIAL_DOWNLOADS.honeygain.download },
      { platform: "linux", label: "Linux / macOS", url: OFFICIAL_DOWNLOADS.honeygain.download },
    ],
    referralCodes: [],
    referralBonusTitle: "500 Mo offerts",
    referralBonusDescription:
      "Créez votre compte Honeygain avec notre code parrain et recevez 500 Mo de bande passante bonus.",
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
      "Non disponible sur l'App Store iOS",
      "Minimum de retrait à 20$",
      "Revenus variables selon la région",
      "Peut ralentir légèrement la connexion",
    ],
    tutorial: [
      { step: 1, title: "S'inscrire", description: "Créez votre compte avec le code parrain Money's House." },
      { step: 2, title: "Télécharger l'app", description: "Installez Honeygain depuis le site officiel (APK Android ou app desktop)." },
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
    logoUrl: localAppLogo("mcmoney.png"),
    description:
      "McMoney vous rémunère pour recevoir des SMS sur votre téléphone.",
    shortDescription: "Revenus via réception de SMS",
    earningsLabel: "Variables",
    difficulty: "easy",
    difficultyLabel: "Facile",
    platforms: ["android"],
    categories: ["sms", "passive"],
    downloadLinks: [
      { platform: "signup", label: "Site officiel", url: OFFICIAL_DOWNLOADS.mcmoney.site },
      { platform: "web", label: "CM.com McMoney", url: OFFICIAL_DOWNLOADS.mcmoney.site },
      {
        platform: "android",
        label: "Télécharger Android (APK)",
        url: OFFICIAL_DOWNLOADS.mcmoney.site,
      },
    ],
    referralCodes: [],
    referralBonusTitle: "Bonus d'inscription McMoney",
    referralBonusDescription:
      "Entrez notre code parrain à l'inscription et recevez un bonus sur votre premier gain McMoney.",
    referralFaqHint: "Entrez le code à l'inscription dans l'application Android.",
    referralInstructions:
      "McMoney — lors de l'inscription :\n\n1. Téléchargez l'APK depuis cm.com/mcmoney et installez l'application.\n2. Créez un compte dans l'application.\n3. Cherchez « Referral code » ou « Code d'invitation » dans les paramètres ou à l'inscription.\n4. Entrez le code Money's House avant de valider.\n\nLe code doit être entré lors de la première configuration du compte.",
    howItWorks:
      "McMoney envoie des SMS de vérification à votre numéro. Vous recevez une rémunération pour chaque SMS reçu.",
    advantages: ["Revenus par SMS reçu", "Aucune action requise", "Paiements rapides"],
    disadvantages: ["Android uniquement", "Nécessite un numéro dédié", "Revenus imprévisibles"],
    tutorial: [
      { step: 1, title: "Installer McMoney", description: "Téléchargez l'APK depuis cm.com/mcmoney et installez l'application." },
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
    logoUrl: localAppLogo("money-sms.png"),
    description:
      "Money SMS rémunère les utilisateurs pour la réception de SMS de vérification.",
    shortDescription: "Gagnez en recevant des SMS",
    earningsLabel: "Variables",
    difficulty: "easy",
    difficultyLabel: "Facile",
    platforms: ["android"],
    categories: ["sms"],
    downloadLinks: [
      { platform: "signup", label: "Créer un compte", url: OFFICIAL_DOWNLOADS.moneySms.siteFr },
      { platform: "web", label: "Site officiel", url: OFFICIAL_DOWNLOADS.moneySms.siteFr },
      {
        platform: "android",
        label: "Télécharger l'APK",
        url: OFFICIAL_DOWNLOADS.moneySms.siteFr,
      },
      {
        platform: "web",
        label: "Guide d'installation",
        url: OFFICIAL_DOWNLOADS.moneySms.installGuide,
      },
    ],
    referralCodes: [],
    referralBonusTitle: "Bonus d'inscription Money SMS",
    referralBonusDescription:
      "Utilisez notre code parrain sur moneysmsapp.com et recevez un bonus sur votre compte Money SMS.",
    referralFaqHint: "Saisissez le code sur moneysmsapp.com lors de la création du compte.",
    referralInstructions:
      "Money SMS — lors de l'inscription :\n\n1. Inscrivez-vous sur moneysmsapp.com/fr.\n2. Lors de la création du compte, un champ « Referral code » est disponible.\n3. Entrez le code Money's House avant de valider.\n4. Téléchargez l'app Android et connectez-vous avec le même compte.\n\nLe code doit être saisi sur le site web avant d'installer l'app.",
    howItWorks:
      "Money SMS utilise votre téléphone comme relais pour recevoir des codes de vérification SMS.",
    advantages: ["Totalement automatisé", "Pas de compétences requises", "Retraits flexibles"],
    disadvantages: ["Android seulement", "Volume de SMS variable", "Revenus modestes"],
    tutorial: [
      { step: 1, title: "Créer un compte", description: "Inscrivez-vous sur moneysmsapp.com avec le code parrain." },
      { step: 2, title: "Installer et configurer", description: "Téléchargez l'APK sur moneysmsapp.com puis autorisez la réception de SMS." },
    ],
    faq: [],
    featured: false,
  },
  {
    id: "gamby",
    slug: "gamby",
    name: "Gamby",
    color: "#22C55E",
    logoUrl: buildAppLogoUrl("https://www.gamby.app"),
    description:
      "Gamby est l'application de pronostics sportifs 100 % gratuite qui récompense vos bonnes prédictions. Football, tennis, basket, MMA, eSport… gagnez des Gambz convertibles en argent réel, sans parier ni déposer d'argent.",
    shortDescription: "Pronostics sportifs gratuits rémunérés",
    earningsLabel: "Variables",
    difficulty: "easy",
    difficultyLabel: "Facile",
    platforms: ["android", "ios"],
    categories: ["games", "surveys"],
    downloadLinks: [
      { platform: "signup", label: "Site officiel", url: OFFICIAL_DOWNLOADS.gamby.site },
      { platform: "android", label: "Google Play", url: OFFICIAL_DOWNLOADS.gamby.androidPlay },
      { platform: "ios", label: "App Store", url: OFFICIAL_DOWNLOADS.gamby.iosAppStore },
    ],
    referralCodes: [],
    referralBonusTitle: "50 Gambz offerts",
    referralBonusDescription:
      "Inscrivez-vous avec notre code parrain et recevez 50 Gambz immédiatement sur Gamby.",
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
    id: "attapoll",
    slug: "attapoll",
    name: "AttaPoll",
    color: "#E53935",
    logoUrl: localAppLogo("attapoll.png"),
    description:
      "AttaPoll vous rémunère pour répondre à des enquêtes rémunérées, jouer à des jeux et tester de nouvelles applications. Gagnez de l'argent depuis votre téléphone et retirez via PayPal, Revolut ou cartes cadeaux.",
    shortDescription: "Sondages et mini-jeux rémunérés",
    earningsMin: 5,
    earningsMax: 35,
    difficulty: "easy",
    difficultyLabel: "Facile",
    platforms: ["android", "ios"],
    categories: ["surveys", "games"],
    downloadLinks: [
      { platform: "signup", label: "Site officiel", url: OFFICIAL_DOWNLOADS.attapoll.siteFrBe },
      { platform: "web", label: "AttaPoll Belgique", url: OFFICIAL_DOWNLOADS.attapoll.siteFrBe },
      { platform: "android", label: "Google Play", url: OFFICIAL_DOWNLOADS.attapoll.androidPlay },
      { platform: "ios", label: "App Store", url: OFFICIAL_DOWNLOADS.attapoll.iosAppStore },
    ],
    referralCodes: [],
    referralBonusTitle: "Bonus de parrainage AttaPoll",
    referralBonusDescription:
      "Inscrivez-vous avec notre code parrain AttaPoll et recevez un bonus lors de votre première activité sur l'application.",
    referralFaqHint:
      "Entrez le code parrain dans l'application AttaPoll, section « Parrainage » ou « Refer a friend », ou lors de l'inscription si le champ est proposé.",
    referralInstructions:
      "AttaPoll — lors de l'inscription :\n\n1. Téléchargez AttaPoll sur le Play Store, l'App Store ou via attapoll.com/fr-be/.\n2. Créez votre compte avec votre email.\n3. Ouvrez le menu Profil ou Paramètres, puis « Parrainage » / « Refer a friend ».\n4. Entrez le code Money's House avant de valider.\n5. Complétez des enquêtes pour cumuler vos gains.\n\nLe code parrain peut être saisi à l'inscription ou depuis votre profil.",
    howItWorks:
      "AttaPoll connecte les utilisateurs à des instituts d'études de marché. Vous recevez des enquêtes adaptées à votre profil, des jeux rémunérés et des missions à tester. Chaque activité complétée crédite votre solde AttaPoll.",
    advantages: [
      "Retrait dès 3 $",
      "PayPal, Revolut et cartes cadeaux",
      "Enquêtes courtes (1 à 15 min)",
      "Application Android et iOS",
      "Programme de parrainage",
    ],
    disadvantages: [
      "Revenus variables selon votre profil",
      "Disponibilité des enquêtes par région",
      "Nécessite une activité régulière",
    ],
    tutorial: [
      { step: 1, title: "Télécharger AttaPoll", description: "Installez l'app depuis attapoll.com/fr-be/, le Play Store ou l'App Store." },
      { step: 2, title: "Entrer le code parrain", description: "Saisissez le code Money's House à l'inscription ou dans la section Parrainage." },
      { step: 3, title: "Compléter des enquêtes", description: "Répondez aux sondages disponibles et cumulez votre solde." },
      { step: 4, title: "Retirer vos gains", description: "Encaissez dès 3 $ via PayPal, Revolut ou carte cadeau." },
    ],
    faq: [
      {
        question: "AttaPoll est-il disponible en Belgique ?",
        answer: "Oui, AttaPoll est disponible en Belgique et dans de nombreux pays. Le site attapoll.com/fr-be/ propose la version francophone pour la Belgique.",
      },
      {
        question: "Quel est le minimum de retrait ?",
        answer: "Le seuil minimum de retrait est de 3 $, avec des options PayPal, Revolut ou cartes cadeaux selon votre région.",
      },
    ],
    featured: true,
  },
  {
    id: "eureka",
    slug: "eureka",
    name: "Eureka Surveys",
    color: "#50E3A4",
    logoUrl: localAppLogo("eureka.png"),
    description:
      "Eureka Surveys vous rémunère pour répondre à des sondages, participer au sondage quotidien et effectuer des check-ins marque. Gagnez de l'argent sur mobile ou sur eurekasurveys.com et retirez via PayPal, virement ou cartes cadeaux.",
    shortDescription: "Sondages rémunérés et sondage quotidien",
    earningsMin: 5,
    earningsMax: 40,
    difficulty: "easy",
    difficultyLabel: "Facile",
    platforms: ["android", "ios", "web"],
    categories: ["surveys", "games"],
    downloadLinks: [
      { platform: "signup", label: "Site officiel", url: OFFICIAL_DOWNLOADS.eureka.site },
      { platform: "web", label: "Eureka Surveys", url: OFFICIAL_DOWNLOADS.eureka.site },
      { platform: "android", label: "Google Play", url: OFFICIAL_DOWNLOADS.eureka.androidPlay },
      { platform: "ios", label: "App Store", url: OFFICIAL_DOWNLOADS.eureka.iosAppStore },
    ],
    referralCodes: [],
    referralBonusTitle: "Bonus de bienvenue Eureka",
    referralBonusDescription:
      "Inscrivez-vous avec notre code parrain Eureka et recevez un bonus sur votre compte dès votre inscription.",
    referralFaqHint:
      "Entrez le code parrain lors de l'inscription dans l'app ou sur eurekasurveys.com, section parrainage.",
    referralInstructions:
      "Eureka Surveys — lors de l'inscription :\n\n1. Téléchargez Eureka sur le Play Store, l'App Store ou rendez-vous sur eurekasurveys.com.\n2. Créez votre compte avec votre email.\n3. Cherchez « Referral code » ou « Code parrain » à l'inscription ou dans les paramètres.\n4. Entrez le code Money's House avant de valider.\n5. Complétez des sondages et le sondage quotidien pour cumuler vos gains.\n\nLe code parrain peut être saisi à l'inscription ou depuis votre profil.",
    howItWorks:
      "Eureka connecte les utilisateurs à des instituts d'études de marché. Vous gagnez en répondant à des sondages, en participant au daily poll gratuit et via les check-ins marque. Les récompenses sont versées en argent réel ou cartes cadeaux.",
    advantages: [
      "1 $ offert sur le premier sondage",
      "Sondage quotidien gratuit",
      "PayPal, virement et cartes cadeaux",
      "Application Android, iOS et site web",
      "Programme de parrainage",
    ],
    disadvantages: [
      "Disponibilité des sondages selon le profil",
      "Certaines enquêtes peuvent disqualifier en cours de route",
      "Support principalement en anglais",
    ],
    tutorial: [
      { step: 1, title: "Télécharger Eureka", description: "Installez l'app ou créez un compte sur eurekasurveys.com." },
      { step: 2, title: "Entrer le code parrain", description: "Saisissez le code Money's House à l'inscription." },
      { step: 3, title: "Compléter des sondages", description: "Répondez aux enquêtes et au daily poll chaque jour." },
      { step: 4, title: "Retirer vos gains", description: "Encaissez via PayPal, virement ou carte cadeau." },
    ],
    faq: [
      {
        question: "Eureka Surveys est-il fiable ?",
        answer: "Eureka est édité par SocialLoop LLC et propose des retraits PayPal et cartes cadeaux. Comme tout site de sondages, les gains dépendent de votre profil et de la disponibilité des enquêtes.",
      },
      {
        question: "Puis-je utiliser Eureka sur ordinateur ?",
        answer: "Oui, eurekasurveys.com permet de répondre aux sondages depuis un navigateur, en plus des apps Android et iOS.",
      },
    ],
    featured: true,
  },
  {
    id: "google-opinion-rewards",
    slug: "google-opinion-rewards",
    name: "Google Opinion Rewards",
    color: "#F5F2FF",
    logoUrl: localAppLogo("google-opinion-rewards.png"),
    description:
      "Google Opinion Rewards vous récompense pour répondre à de courts sondages.",
    shortDescription: "Récompenses via sondages Google",
    earningsLabel: "Récompenses Google Play",
    difficulty: "very-easy",
    difficultyLabel: "Très facile",
    platforms: ["android", "ios"],
    categories: ["surveys"],
    downloadLinks: [
      {
        platform: "android",
        label: "Google Play",
        url: OFFICIAL_DOWNLOADS.googleOpinionRewards.androidPlay,
      },
      {
        platform: "ios",
        label: "App Store",
        url: OFFICIAL_DOWNLOADS.googleOpinionRewards.iosAppStore,
      },
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
