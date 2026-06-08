"use client";

import { ExternalLink, MessageCircle, Globe } from "lucide-react";
import type { Partner } from "@/lib/partners-shared";
import { useTranslation } from "@/context/LanguageContext";

export function PartnerCard({ partner }: { partner: Partner }) {
  const { t } = useTranslation();

  return (
    <article className="rounded-[28px] bg-phantom-surface border border-phantom-dark/5 p-6 md:p-8 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="w-14 h-14 rounded-2xl object-cover border border-phantom-dark/10 shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-phantom-lavender/50 flex items-center justify-center text-xl font-bold text-phantom-purple shrink-0">
            {partner.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-phantom-dark">{partner.name}</h3>
          {partner.tagline && (
            <p className="text-sm text-phantom-purple mt-1">{partner.tagline}</p>
          )}
        </div>
      </div>

      {partner.description && (
        <p className="text-phantom-gray text-sm mb-4 flex-1">{partner.description}</p>
      )}

      {partner.offers.length > 0 && (
        <ul className="mb-4 space-y-1.5">
          {partner.offers.map((offer) => (
            <li key={offer} className="text-sm text-phantom-dark flex gap-2">
              <span className="text-phantom-purple">•</span>
              <span>{offer}</span>
            </li>
          ))}
        </ul>
      )}

      {partner.promoText && (
        <div className="mb-4 rounded-[16px] bg-phantom-lavender/30 border border-phantom-purple/20 px-4 py-3 text-sm text-phantom-dark">
          {partner.promoText}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {partner.websiteUrl && (
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-phantom-dark text-phantom-cream text-sm font-medium hover:opacity-90"
          >
            <Globe className="h-4 w-4" />
            {t("partners.website")}
          </a>
        )}
        {partner.discordUrl && (
          <a
            href={partner.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5865F2] text-white text-sm font-medium hover:bg-[#4752c4]"
          >
            <MessageCircle className="h-4 w-4" />
            Discord
          </a>
        )}
        {(partner.websiteUrl || partner.discordUrl) && (
          <span className="sr-only">
            <ExternalLink aria-hidden />
          </span>
        )}
      </div>
    </article>
  );
}
