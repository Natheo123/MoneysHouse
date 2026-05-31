import type { Metadata } from "next";
import { faqItems } from "@/lib/data/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-line">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
