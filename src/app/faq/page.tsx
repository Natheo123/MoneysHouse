"use client";

import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { PageShell } from "@/components/layout/PageShell";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

export default function FAQPage() {
  const { t } = useTranslation();
  const { faqItems } = useLanguage();

  return (
    <PageShell maxWidth="3xl">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
          {t("faqPage.title")}
        </h1>
        <p className="text-phantom-gray text-base sm:text-lg">{t("faqPage.subtitle")}</p>
      </div>

      <div className="rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5 p-4 sm:p-8">
        <FaqAccordion items={faqItems} />
      </div>
    </PageShell>
  );
}
