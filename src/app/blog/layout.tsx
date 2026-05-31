import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Guides et comparatifs revenus passifs",
  description:
    "Articles, guides et comparatifs pour maximiser vos revenus passifs avec les meilleures applications.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
