import type { Metadata } from "next";
import { LegalPageClient } from "@/components/legal/LegalPageClient";

export const metadata: Metadata = {
  title: "À propos — Money's House",
  description:
    "Découvrez la mission de Money's House : comparer, tester et recommander les meilleures applications de revenus passifs.",
};

export default function AboutPage() {
  return <LegalPageClient pageId="about" />;
}
