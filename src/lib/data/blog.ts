import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "comment-gagner-50-euros-mois-passivement",
    title: "Comment gagner 50€/mois passivement en 2026",
    excerpt:
      "Découvrez la stratégie complète pour atteindre 50€ de revenus passifs chaque mois en combinant les meilleures applications.",
    content: `
## Introduction

Atteindre 50€ par mois de revenus passifs est un objectif réaliste en 2026. Voici comment y parvenir.

## Étape 1 : Combiner EarnApp et Honeygain

Les deux applications de partage de bande passante peuvent tourner simultanément sur vos appareils. Avec une bonne connexion fibre, comptez 20-30€/mois.

## Étape 2 : Ajouter Google Opinion Rewards

Les sondages Google ajoutent 5-10€ en crédits Play chaque mois, utilisables pour des achats numériques.

## Étape 3 : Optimiser vos appareils

Plus vous avez d'appareils connectés (PC, téléphone, tablette), plus vos revenus augmentent.

## Conclusion

Avec cette combinaison, 50€/mois est atteignable en moins d'un mois de configuration.
    `,
    date: "2026-05-15",
    readTime: "5 min",
    category: "Guide",
    iconId: "chart",
  },
  {
    slug: "meilleures-applications-revenus-passifs-2026",
    title: "Meilleures applications de revenus passifs en 2026",
    excerpt:
      "Notre sélection des applications les plus fiables et rentables pour générer des revenus passifs cette année.",
    content: `
## Top 5 des applications 2026

1. **EarnApp** - Le meilleur pour débuter
2. **Honeygain** - La plus populaire
3. **Google Opinion Rewards** - Officiel Google
4. **McMoney** - Pour les SMS
5. **Money SMS** - Alternative SMS

## Critères de sélection

Nous évaluons chaque app sur : fiabilité des paiements, facilité d'utilisation, revenus moyens et support client.
    `,
    date: "2026-05-01",
    readTime: "8 min",
    category: "Comparatif",
    iconId: "trophy",
  },
  {
    slug: "earnapp-vs-honeygain",
    title: "EarnApp vs Honeygain : le comparatif complet",
    excerpt:
      "Quelle application de partage de bande passante choisir ? Nous comparons EarnApp et Honeygain sur tous les critères.",
    content: `
## EarnApp vs Honeygain

| Critère | EarnApp | Honeygain |
|---------|---------|-----------|
| Revenus max | 50€/mois | 40€/mois |
| Minimum retrait | 5$ | 20$ |
| Interface | Simple | Très intuitive |
| Parrainage | Oui | Oui (généreux) |

## Verdict

Pour débuter : **EarnApp** (retrait plus bas). Pour maximiser : utilisez **les deux** simultanément.
    `,
    date: "2026-04-20",
    readTime: "6 min",
    category: "Comparatif",
    iconId: "compare",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
