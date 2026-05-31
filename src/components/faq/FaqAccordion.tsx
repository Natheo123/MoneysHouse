"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { apps } from "@/lib/data/apps";
import { siteConfig } from "@/lib/config";
import {
  getAllReferralData,
  getReferralBonus,
  hasReferralProgram,
  REFERRAL_CODES_UPDATED_EVENT,
  type AppReferrals,
} from "@/lib/referrals";
import type { FAQItem } from "@/types";

interface FaqAccordionProps {
  items: FAQItem[];
}

function ReferralFaqAnswer() {
  const [dataByApp, setDataByApp] = useState<Record<string, AppReferrals>>({});
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setDataByApp(getAllReferralData());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(REFERRAL_CODES_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(REFERRAL_CODES_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-phantom-gray leading-relaxed">
        Cliquez sur un lien d&apos;installation pour voir le bonus exact et récupérer le code ou le
        lien parrain avant de vous inscrire.
      </p>

      {apps.map((app) => {
        const data = dataByApp[app.id] ?? { codes: [], links: [] };
        const bonus = getReferralBonus(app.id);
        const withReferral = hasReferralProgram(app.id);
        const hasContent = data.codes.length > 0 || data.links.length > 0;

        return (
          <div
            key={app.id}
            className="rounded-[20px] bg-phantom-bg border border-phantom-dark/5 p-4"
          >
            <Link
              href={`/apps/${app.slug}`}
              className="font-medium text-phantom-dark hover:text-phantom-purple transition-colors"
            >
              {app.name}
            </Link>

            {withReferral && bonus && (
              <div
                className="mt-3 p-3 rounded-[16px] border border-phantom-purple/20"
                style={{ background: `${app.color}22` }}
              >
                <p className="text-lg font-bold text-phantom-dark">{bonus.title}</p>
                <p className="text-sm text-phantom-gray mt-1">{bonus.description}</p>
              </div>
            )}

            {withReferral ? (
              hasContent ? (
                <div className="mt-3 space-y-4">
                  {data.codes.length > 0 && (
                    <ul className="space-y-2">
                      {data.codes.map((code) => (
                        <li key={code} className="flex items-center justify-between gap-3">
                          <code className="text-base font-bold text-phantom-dark tracking-wide">
                            {code}
                          </code>
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
                            {copiedValue === code ? "Copié" : "Copier"}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {data.links.length > 0 && (
                    <ul className="space-y-2">
                      {data.links.map((link) => (
                        <li key={link} className="flex items-center justify-between gap-3">
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
                <p className="mt-2 text-sm text-phantom-gray">
                  Aucun code ou lien disponible pour le moment. Rejoignez notre{" "}
                  <a
                    href={siteConfig.links.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-phantom-purple hover:underline"
                  >
                    Discord
                  </a>{" "}
                  pour en obtenir un.
                </p>
              )
            ) : (
              <p className="mt-2 text-sm text-phantom-gray">Pas de programme de parrainage.</p>
            )}

            {app.referralFaqHint && withReferral && (
              <p className="mt-3 text-sm text-phantom-gray leading-relaxed">{app.referralFaqHint}</p>
            )}
          </div>
        );
      })}

      <p className="text-sm text-phantom-gray">
        Consultez la{" "}
        <Link href="/apps" className="text-phantom-purple hover:underline">
          fiche de chaque application
        </Link>{" "}
        pour le guide détaillé.
      </p>
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
