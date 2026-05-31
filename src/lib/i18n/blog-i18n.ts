import type { Locale } from "./types";
import { getBlogPost } from "@/lib/data/blog";

export interface LocalizedBlogPostMeta {
  title: string;
  excerpt: string;
  category: string;
}

const blogMetaFr: Record<string, LocalizedBlogPostMeta> = {
  "comment-gagner-50-euros-mois-passivement": {
    title: "Comment gagner 50€/mois passivement en 2026",
    excerpt:
      "Découvrez la stratégie complète pour atteindre 50€ de revenus passifs chaque mois en combinant les meilleures applications.",
    category: "Guide",
  },
  "meilleures-applications-revenus-passifs-2026": {
    title: "Meilleures applications de revenus passifs en 2026",
    excerpt:
      "Notre sélection des applications les plus fiables et rentables pour générer des revenus passifs cette année.",
    category: "Comparatif",
  },
  "earnapp-vs-honeygain": {
    title: "EarnApp vs Honeygain : le comparatif complet",
    excerpt:
      "Quelle application de partage de bande passante choisir ? Nous comparons EarnApp et Honeygain sur tous les critères.",
    category: "Comparatif",
  },
};

const blogMetaEn: Record<string, LocalizedBlogPostMeta> = {
  "comment-gagner-50-euros-mois-passivement": {
    title: "How to earn €50/month passively in 2026",
    excerpt:
      "Discover the full strategy to reach €50 in passive income every month by combining the best apps.",
    category: "Guide",
  },
  "meilleures-applications-revenus-passifs-2026": {
    title: "Best passive income apps in 2026",
    excerpt:
      "Our pick of the most reliable and profitable apps to generate passive income this year.",
    category: "Comparison",
  },
  "earnapp-vs-honeygain": {
    title: "EarnApp vs Honeygain: the full comparison",
    excerpt:
      "Which bandwidth-sharing app should you choose? We compare EarnApp and Honeygain on every criterion.",
    category: "Comparison",
  },
};

export function getLocalizedBlogPost(slug: string, locale: Locale): LocalizedBlogPostMeta | undefined {
  const post = getBlogPost(slug);
  if (!post) return undefined;

  const meta = locale === "en" ? blogMetaEn[slug] : blogMetaFr[slug];
  if (meta) return meta;

  return {
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
  };
}
