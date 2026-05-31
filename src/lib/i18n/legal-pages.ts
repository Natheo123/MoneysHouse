import type { Locale } from "./types";
import { siteConfig } from "@/lib/config";
import { apps } from "@/lib/data/apps";

export type LegalPageId = "about" | "privacy" | "terms";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export interface LegalPageContent {
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
  discordButton?: string;
  viewAppsButton?: string;
  seeAlsoPrivacy?: string;
  privacyLinkLabel?: string;
}

const legalPagesFr: Record<LegalPageId, LegalPageContent> = {
  about: {
    title: "À propos",
    description: `${siteConfig.name} est une plateforme indépendante qui aide les utilisateurs à découvrir des applications de revenus passifs fiables.`,
    updatedAt: "31 mai 2026",
    sections: [
      {
        title: "Notre mission",
        paragraphs: [
          "Money's House a été créé pour simplifier le choix des applications qui permettent de générer des revenus passifs en ligne. Nous testons, comparons et présentons uniquement des services que nous jugeons utiles et transparents.",
          "Notre objectif est de vous faire gagner du temps : au lieu de parcourir des dizaines d'applications, vous trouvez ici des fiches détaillées, des comparatifs et des liens de parrainage vérifiés.",
        ],
      },
      {
        title: "Ce que nous proposons",
        paragraphs: [
          `Un catalogue de ${apps.length} applications testées avec fiches détaillées, classements, comparateur et articles de blog pour vous guider.`,
          "Des codes de parrainage mis à jour par notre équipe lorsqu'ils sont disponibles.",
          "Un espace utilisateur pour suivre vos applications favorites et recevoir des rappels.",
        ],
      },
      {
        title: "Notre indépendance",
        paragraphs: [
          "Money's House peut percevoir une rémunération lorsque vous vous inscrivez via certains liens de parrainage. Cela ne change pas le prix pour vous et nous n'influons pas nos classements en fonction de ces partenariats.",
          "Nous indiquons clairement les avantages et limites de chaque application pour que vous puissiez faire un choix éclairé.",
        ],
      },
      {
        title: "Nous contacter",
        paragraphs: [
          "Une question, une suggestion ou un signalement ? Rejoignez notre communauté Discord.",
        ],
      },
    ],
    discordButton: "Rejoindre Discord",
    viewAppsButton: "Voir les applications",
  },
  privacy: {
    title: "Politique de confidentialité",
    description: "Cette page explique quelles données nous collectons et comment nous les utilisons.",
    updatedAt: "31 mai 2026",
    sections: [
      {
        title: "Responsable du traitement",
        paragraphs: [
          `Le site ${siteConfig.url} est édité par Money's House. Pour toute question relative à vos données, contactez-nous sur notre serveur Discord : ${siteConfig.links.discord}.`,
        ],
      },
      {
        title: "Données collectées",
        paragraphs: [
          "Données de compte : adresse e-mail et nom lorsque vous créez un compte sur Money's House.",
          "Données d'utilisation : pages consultées, préférences d'applications et interactions avec le site (via cookies techniques et stockage local du navigateur).",
          "Données d'administration : accès réservé aux membres autorisés pour la gestion des parrainages et des preuves.",
        ],
      },
      {
        title: "Finalités",
        paragraphs: [
          "Fournir et améliorer les services du site (compte utilisateur, dashboard, comparateur).",
          "Gérer les liens de parrainage et le contenu éditorial.",
          "Assurer la sécurité du site et prévenir les abus.",
          "Répondre à vos demandes via Discord.",
        ],
      },
      {
        title: "Cookies et stockage local",
        paragraphs: [
          "Nous utilisons le stockage local de votre navigateur pour mémoriser votre session, vos préférences et certaines données du dashboard.",
          "Des cookies techniques peuvent être utilisés pour le bon fonctionnement du site. Aucun cookie publicitaire tiers n'est déposé par Money's House.",
        ],
      },
      {
        title: "Partage des données",
        paragraphs: [
          "Nous ne vendons pas vos données personnelles.",
          "Certaines données peuvent être hébergées par nos prestataires techniques (hébergement, déploiement) dans le cadre strict de l'exploitation du service.",
          "Lorsque vous cliquez sur un lien vers une application tierce, vous quittez Money's House et êtes soumis à la politique de confidentialité de ce service.",
        ],
      },
      {
        title: "Durée de conservation",
        paragraphs: [
          "Les données de compte sont conservées tant que votre compte est actif. Vous pouvez demander leur suppression.",
          "Les journaux techniques sont conservés pour une durée limitée, nécessaire à la sécurité et au diagnostic.",
        ],
      },
      {
        title: "Vos droits",
        paragraphs: [
          "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de limitation du traitement de vos données.",
          `Pour exercer ces droits, contactez-nous sur Discord (${siteConfig.links.discord}). Vous pouvez également introduire une réclamation auprès de la CNIL.`,
        ],
      },
    ],
  },
  terms: {
    title: "Conditions d'utilisation",
    description: "En utilisant Money's House, vous acceptez les conditions décrites ci-dessous.",
    updatedAt: "31 mai 2026",
    sections: [
      {
        title: "Objet",
        paragraphs: [
          `${siteConfig.name} est un site d'information et de comparaison d'applications de revenus passifs. Nous fournissons des contenus éditoriaux, des liens de parrainage et des outils d'aide à la décision.`,
          "Money's House n'est pas une application de gains en soi : les paiements et conditions des récompenses dépendent exclusivement des services tiers que vous choisissez d'utiliser.",
        ],
      },
      {
        title: "Accès au service",
        paragraphs: [
          "L'accès au site est gratuit. Certaines fonctionnalités (dashboard, favoris) nécessitent la création d'un compte.",
          "Vous vous engagez à fournir des informations exactes et à ne pas usurper l'identité d'un tiers.",
          "Nous nous réservons le droit de suspendre un compte en cas d'usage frauduleux ou contraire à ces conditions.",
        ],
      },
      {
        title: "Liens et parrainages",
        paragraphs: [
          "Les liens vers des applications tierces peuvent inclure des codes de parrainage. Money's House peut percevoir une commission sans surcoût pour vous.",
          "Nous nous efforçons de maintenir des liens à jour, mais nous ne garantissons pas la disponibilité permanente d'une offre ou d'un bonus.",
          "Toute inscription sur une application tierce est soumise aux conditions de ce service.",
        ],
      },
      {
        title: "Contenu et propriété intellectuelle",
        paragraphs: [
          "Les textes, visuels et la structure du site sont protégés. Toute reproduction non autorisée est interdite.",
          "Les marques et logos des applications mentionnées appartiennent à leurs propriétaires respectifs.",
        ],
      },
      {
        title: "Limitation de responsabilité",
        paragraphs: [
          "Les informations publiées le sont à titre indicatif. Les revenus mentionnés sont des estimations et peuvent varier selon votre pays, votre appareil et votre utilisation.",
          "Money's House ne peut être tenu responsable des pertes, indisponibilités ou changements de politique des applications tierces.",
          "Le site est fourni « en l'état ». Nous ne garantissons pas une disponibilité ininterrompue du service.",
        ],
      },
      {
        title: "Modifications",
        paragraphs: [
          "Nous pouvons mettre à jour ces conditions à tout moment. La date de dernière mise à jour est indiquée en haut de cette page.",
          "La poursuite de l'utilisation du site après modification vaut acceptation des nouvelles conditions.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          `Pour toute question relative à ces conditions, contactez-nous à ${siteConfig.ownerEmail} ou via notre serveur Discord.`,
        ],
      },
    ],
    seeAlsoPrivacy: "Consultez aussi notre",
    privacyLinkLabel: "politique de confidentialité",
  },
};

const legalPagesEn: Record<LegalPageId, LegalPageContent> = {
  about: {
    title: "About",
    description: `${siteConfig.name} is an independent platform that helps users discover reliable passive income apps.`,
    updatedAt: "May 31, 2026",
    sections: [
      {
        title: "Our mission",
        paragraphs: [
          "Money's House was created to simplify choosing apps that generate passive income online. We test, compare, and present only services we consider useful and transparent.",
          "Our goal is to save you time: instead of browsing dozens of apps, you find detailed pages, comparisons, and verified referral links here.",
        ],
      },
      {
        title: "What we offer",
        paragraphs: [
          `A catalog of ${apps.length} tested apps with detailed pages, rankings, a comparison tool, and blog articles to guide you.`,
          "Referral codes updated by our team when available.",
          "A user area to track your favorite apps and receive reminders.",
        ],
      },
      {
        title: "Our independence",
        paragraphs: [
          "Money's House may earn compensation when you sign up through certain referral links. This does not change the price for you, and we do not influence our rankings based on these partnerships.",
          "We clearly state the pros and cons of each app so you can make an informed choice.",
        ],
      },
      {
        title: "Contact us",
        paragraphs: [
          "Have a question, suggestion, or report? Join our Discord community.",
        ],
      },
    ],
    discordButton: "Join Discord",
    viewAppsButton: "Browse apps",
  },
  privacy: {
    title: "Privacy policy",
    description: "This page explains what data we collect and how we use it.",
    updatedAt: "May 31, 2026",
    sections: [
      {
        title: "Data controller",
        paragraphs: [
          `The site ${siteConfig.url} is operated by Money's House. For any questions about your data, contact us on our Discord server: ${siteConfig.links.discord}.`,
        ],
      },
      {
        title: "Data we collect",
        paragraphs: [
          "Account data: email address and name when you create a Money's House account.",
          "Usage data: pages viewed, app preferences, and interactions with the site (via technical cookies and browser local storage).",
          "Administration data: access restricted to authorized members for managing referrals and payment proofs.",
        ],
      },
      {
        title: "Purposes",
        paragraphs: [
          "Provide and improve site services (user account, dashboard, comparison tool).",
          "Manage referral links and editorial content.",
          "Ensure site security and prevent abuse.",
          "Respond to your requests via Discord.",
        ],
      },
      {
        title: "Cookies and local storage",
        paragraphs: [
          "We use your browser's local storage to remember your session, preferences, and certain dashboard data.",
          "Technical cookies may be used for the site to function properly. Money's House does not place third-party advertising cookies.",
        ],
      },
      {
        title: "Data sharing",
        paragraphs: [
          "We do not sell your personal data.",
          "Some data may be hosted by our technical providers (hosting, deployment) strictly for operating the service.",
          "When you click a link to a third-party app, you leave Money's House and are subject to that service's privacy policy.",
        ],
      },
      {
        title: "Retention period",
        paragraphs: [
          "Account data is kept while your account is active. You may request deletion.",
          "Technical logs are kept for a limited time required for security and diagnostics.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "Under the GDPR, you have the right to access, rectify, delete, and restrict processing of your data.",
          `To exercise these rights, contact us on Discord (${siteConfig.links.discord}). You may also file a complaint with your local data protection authority.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms of use",
    description: "By using Money's House, you accept the terms described below.",
    updatedAt: "May 31, 2026",
    sections: [
      {
        title: "Purpose",
        paragraphs: [
          `${siteConfig.name} is an information and comparison site for passive income apps. We provide editorial content, referral links, and decision-support tools.`,
          "Money's House is not an earning app itself: payouts and reward terms depend solely on the third-party services you choose to use.",
        ],
      },
      {
        title: "Access to the service",
        paragraphs: [
          "Access to the site is free. Some features (dashboard, favorites) require creating an account.",
          "You agree to provide accurate information and not impersonate anyone else.",
          "We reserve the right to suspend an account in case of fraudulent use or violation of these terms.",
        ],
      },
      {
        title: "Links and referrals",
        paragraphs: [
          "Links to third-party apps may include referral codes. Money's House may earn a commission at no extra cost to you.",
          "We strive to keep links up to date, but we do not guarantee permanent availability of any offer or bonus.",
          "Any sign-up on a third-party app is subject to that service's terms.",
        ],
      },
      {
        title: "Content and intellectual property",
        paragraphs: [
          "Site text, visuals, and structure are protected. Unauthorized reproduction is prohibited.",
          "Trademarks and logos of mentioned apps belong to their respective owners.",
        ],
      },
      {
        title: "Limitation of liability",
        paragraphs: [
          "Information published is for guidance only. Earnings mentioned are estimates and may vary by country, device, and usage.",
          "Money's House cannot be held liable for losses, downtime, or policy changes by third-party apps.",
          "The site is provided \"as is\". We do not guarantee uninterrupted availability.",
        ],
      },
      {
        title: "Changes",
        paragraphs: [
          "We may update these terms at any time. The last updated date is shown at the top of this page.",
          "Continued use of the site after changes constitutes acceptance of the new terms.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          `For any questions about these terms, contact us at ${siteConfig.ownerEmail} or via our Discord server.`,
        ],
      },
    ],
    seeAlsoPrivacy: "See also our",
    privacyLinkLabel: "privacy policy",
  },
};

export function getLegalPage(locale: Locale, page: LegalPageId): LegalPageContent {
  return locale === "en" ? legalPagesEn[page] : legalPagesFr[page];
}
