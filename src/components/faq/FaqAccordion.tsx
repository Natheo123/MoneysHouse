"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { apps } from "@/lib/data/apps";
import { useReferrals, hasReferralProgram } from "@/context/ReferralContext";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import type { FAQItem } from "@/types";

interface FaqAccordionProps {
  items: FAQItem[];
}

function ReferralFaqAnswer() {
  const { t } = useTranslation();
  const { localizedApps } = useLanguage();
  const { ready, referrals, getReferralData, getReferralBonus } = useReferrals();
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  if (!ready) {
    return <p className="text-sm text-phantom-gray">{t("faqAccordion.loadingCodes")}</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-phantom-gray leading-relaxed">
        {t("faqAccordion.faqIntro")}
      </p>

      {localizedApps.map((localizedApp) => {
        const baseApp = apps.find((a) => a.id === localizedApp.id) ?? localizedApp;
        const data = referrals[localizedApp.id] ?? getReferralData(localizedApp.id);
        const bonus = getReferralBonus(localizedApp.id);
        const withReferral = hasReferralProgram(localizedApp.id);
        const hasContent = data.codes.length > 0 || data.links.length > 0;

        const bonusTitle =
          bonus && bonus.title === baseApp.referralBonusTitle
            ? (localizedApp.referralBonusTitle ?? bonus.title)
            : bonus?.title;
        const bonusDescription =
          bonus && bonus.description === baseApp.referralBonusDescription
            ? (localizedApp.referralBonusDescription ?? bonus.description)
            : bonus?.description;

        return (
          <div
            key={localizedApp.id}
            className="rounded-[20px] bg-phantom-bg border border-phantom-dark/5 p-4"
          >
            <Link
              href={`/apps/${localizedApp.slug}`}
              className="font-medium text-phantom-dark hover:text-phantom-purple transition-colors"
            >
              {localizedApp.name}
            </Link>

            {withReferral && bonus && bonusTitle && (
              <div
                className="mt-3 p-3 rounded-[16px] border border-phantom-purple/20"
                style={{ background: `${localizedApp.color}22` }}
              >
                <p className="text-lg font-bold text-phantom-dark">{bonusTitle}</p>
                {bonusDescription && (
                  <p className="text-sm text-phantom-gray mt-1">{bonusDescription}</p>
                )}
              </div>
            )}

            {withReferral ? (
              hasContent ? (
                <div className="mt-3 space-y-4">
                  {data.codes.length > 0 && (
                    <ul className="space-y-2">
                      {data.codes.map((code) => (
                        <li key={code} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <code className="text-sm font-bold text-phantom-dark break-all">{code}</code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyValue(code)}
                            className="gap-1 shrink-0 h-8"
                          >
                            {copiedValue === code ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedValue === code ? t("faqAccordion.copied") : t("faqAccordion.copy")}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {data.links.length > 0 && (
                    <ul className="space-y-2">
                      {data.links.map((link) => (
                        <li key={link} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-phantom-purple hover:underline break-all"
                          >
                            {link}
                          </a>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyValue(link)}
                              className="h-8"
                            >
                              {copiedValue === link ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button size="sm" variant="outline" asChild className="h-8">
                              <a href={link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-phantom-gray">{t("faqAccordion.noCodes")}</p>
              )
            ) : (
              <p className="mt-2 text-sm text-phantom-gray">{t("faqAccordion.noProgram")}</p>
            )}

            {localizedApp.referralFaqHint && withReferral && (
              <p className="mt-3 text-sm text-phantom-gray leading-relaxed">
                {localizedApp.referralFaqHint}
              </p>
            )}
          </div>
        );
      })}

      <p className="text-sm text-phantom-gray">{t("faqAccordion.seeAppPage")}</p>
    </div>
  );
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={item.id ?? i} value={`faq-${i}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            {item.id === "referral" ? (
              <ReferralFaqAnswer />
            ) : (
              <p className="whitespace-pre-line text-phantom-gray leading-relaxed">{item.answer}</p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
