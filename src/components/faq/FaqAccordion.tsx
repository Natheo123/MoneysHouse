"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
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
  getAllReferralCodes,
  hasReferralProgram,
  REFERRAL_CODES_UPDATED_EVENT,
} from "@/lib/referrals";
import type { FAQItem } from "@/types";

interface FaqAccordionProps {
  items: FAQItem[];
}

function ReferralFaqAnswer() {
  const [codesByApp, setCodesByApp] = useState<Record<string, string[]>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setCodesByApp(getAllReferralCodes());
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

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-phantom-gray leading-relaxed">
        Avant chaque téléchargement, une fenêtre vous rappelle d&apos;utiliser nos codes parrainage.
        Copiez un code ci-dessous, puis suivez les instructions pour chaque application.
      </p>

      {apps.map((app) => {
        const codes = codesByApp[app.id] ?? [];
        const withReferral = hasReferralProgram(app.id);

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

            {withReferral ? (
              codes.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {codes.map((code) => (
                    <li key={code} className="flex items-center justify-between gap-3">
                      <code className="text-base font-bold text-phantom-dark tracking-wide">
                        {code}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(code)}
                        className="gap-1 shrink-0 h-8"
                      >
                        {copiedCode === code ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copiedCode === code ? "Copié" : "Copier"}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-phantom-gray">
                  Aucun code disponible pour le moment. Rejoignez notre{" "}
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
