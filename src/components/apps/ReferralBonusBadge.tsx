"use client";

import { Sparkles } from "lucide-react";
import { useReferrals, hasReferralProgram } from "@/context/ReferralContext";
import { apps } from "@/lib/data/apps";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

export function ReferralBonusBadge({ appId }: { appId: string }) {
  const { t } = useTranslation();
  const { getLocalizedApp, locale } = useLanguage();
  const { ready, getReferralBonus } = useReferrals();

  if (!ready || !hasReferralProgram(appId)) return null;

  const bonus = getReferralBonus(appId);
  if (!bonus) return null;

  const app = apps.find((a) => a.id === appId);
  const localizedApp = app ? getLocalizedApp(app) : null;
  const title =
    locale === "en" && localizedApp?.referralBonusTitle
      ? localizedApp.referralBonusTitle
      : bonus.title;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-phantom-dark bg-phantom-purple/25 px-2.5 py-1 rounded-full max-w-full truncate">
      <Sparkles className="h-3 w-3 text-phantom-purple" />
      {title} {t("referral.withOurCode")}
    </span>
  );
}
