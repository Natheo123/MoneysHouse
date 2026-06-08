/** Traductions EN pour le contenu auto-généré des apps custom (recherche admin). */

const LINK_LABELS: Record<string, string> = {
  "Site officiel": "Official website",
  "Créer un compte": "Create an account",
  Accéder: "Open",
  "Télécharger": "Download",
  "Inscription": "Sign up",
};

const EXACT_PHRASES: Record<string, string> = {
  "À compléter après vérification": "To be completed after verification",
  "Consultez le site officiel pour les instructions détaillées.":
    "See the official website for detailed instructions.",
  "Facile": "Easy",
  "Moyen": "Medium",
  "Difficile": "Hard",
};

const PATTERN_PHRASES: [RegExp, string][] = [
  [/^Découvrez comment (.+?) fonctionne sur (.+?)\.$/i, "Learn how $1 works on $2."],
  [/^Inscrivez-vous sur (.+?)\.$/i, "Sign up on $1."],
  [/^Comment utiliser (.+?) \?$/i, "How do I use $1?"],
  [/^Application (.+?) — informations à compléter\.$/i, "$1 app — details to be completed."],
  [
    /^Gagnez de l'argent facilement avec (.+?) ! Téléchargez l'application gratuite et gagnez de l'argent simplement en recevant des SMS\.?$/i,
    "Earn money easily with $1! Download the free app and get paid simply by receiving SMS messages.",
  ],
  [
    /^gagnez de l'argent simplement en recevant des SMS\.?$/i,
    "earn money simply by receiving SMS messages.",
  ],
  [
    /^Approuvé par 60M\+ d'utilisateurs\. Gagne de l'argent gratuit avec des jeux, sondages, petits boulots & plus\. 💰 Reçois jusqu'à 100€ par offre sur Freecash\.?$/i,
    "Trusted by 60M+ users. Earn free money with games, surveys, side gigs & more. 💰 Get up to $108 per offer on FreeCash.",
  ],
];

function translatePhrase(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const exact = EXACT_PHRASES[trimmed];
  if (exact) return exact;

  for (const [pattern, replacement] of PATTERN_PHRASES) {
    if (pattern.test(trimmed)) {
      return trimmed.replace(pattern, replacement);
    }
  }

  return trimmed
    .replace(/\bGagnez de l'argent\b/gi, "Earn money")
    .replace(/\bGagne de l'argent\b/gi, "Earn money")
    .replace(/\bgratuit\b/gi, "free")
    .replace(/\bgratuite\b/gi, "free")
    .replace(/\bsondages\b/gi, "surveys")
    .replace(/\bjeux\b/gi, "games")
    .replace(/\bpetits boulots\b/gi, "side gigs")
    .replace(/\bApprouvé par\b/gi, "Trusted by")
    .replace(/\bd'utilisateurs\b/gi, "users")
    .replace(/\bTéléchargez\b/gi, "Download")
    .replace(/\bapplication\b/gi, "app")
    .replace(/\bInscrivez-vous\b/gi, "Sign up")
    .replace(/\bConsultez\b/gi, "See")
    .replace(/\ble site officiel\b/gi, "the official website")
    .replace(/\bpour les instructions détaillées\b/gi, "for detailed instructions")
    .replace(/\bsimplement\b/gi, "simply")
    .replace(/\ben recevant des SMS\b/gi, "by receiving SMS")
    .replace(/\bReçois\b/gi, "Get")
    .replace(/\bpar offre\b/gi, "per offer")
    .replace(/\bJusqu'à\b/gi, "Up to")
    .replace(/\bjusqu'à\b/gi, "up to");
}

export function translateLinkLabel(label: string): string {
  return LINK_LABELS[label.trim()] ?? translatePhrase(label);
}

export function translateCustomFrenchText(text: string): string {
  if (!text?.trim()) return text;
  return translatePhrase(text);
}
