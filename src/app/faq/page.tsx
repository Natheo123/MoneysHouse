import type { Metadata } from "next";
import { faqItems } from "@/lib/data/faq";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes sur les revenus passifs",
  description:
    "Réponses aux questions les plus fréquentes sur les applications de revenus passifs, la légalité, les paiements et les pays supportés.",
};

export default function FAQPage() {
  return (
    <PageShell maxWidth="3xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
            FAQ
          </h1>
          <p className="text-phantom-gray text-base sm:text-lg">
            Toutes les réponses à vos questions sur les revenus passifs
          </p>
        </div>

        <div className="rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5 p-4 sm:p-8">
          <FaqAccordion items={faqItems} />
        </div>
    </PageShell>
  );
}
