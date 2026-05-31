import type { Metadata } from "next";
import { faqItems } from "@/lib/data/faq";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes sur les revenus passifs",
  description:
    "Réponses aux questions les plus fréquentes sur les applications de revenus passifs, la légalité, les paiements et les pays supportés.",
};

export default function FAQPage() {
  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
            FAQ
          </h1>
          <p className="text-phantom-gray text-lg">
            Toutes les réponses à vos questions sur les revenus passifs
          </p>
        </div>

        <div className="rounded-[32px] bg-phantom-surface border border-phantom-dark/5 p-8">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </div>
  );
}
