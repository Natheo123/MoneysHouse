"use client";

import { Sparkles } from "lucide-react";
import { useReferrals, hasReferralProgram } from "@/context/ReferralContext";
import { useApps } from "@/context/AppsContext";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

export function ReferralBonusBadge({ appId }: { appId: string }) {
  const { t } = useTranslation();
  const { getLocalizedApp, locale } = useLanguage();
  const { apps } = useApps();
  const { ready, getReferralBonus } = useReferrals();
  const app = apps.find((entry) => entry.id === appId);

  if (!ready || !hasReferralProgram(appId, app)) return null;

  const bonus = getReferralBonus(appId);
  if (!bonus) return null;

  const localizedApp = app ? getLocalizedApp(app) : null;
  const title =
    locale === "en" && localizedApp?.referralBonusTitle
      ? localizedApp.referralBonusTitle
      : bonus.title;

  return (
    <span className="flex w-full min-w-0 items-center gap-1 text-xs font-semibold text-phantom-dark bg-phantom-purple/25 px-2.5 py-1 rounded-full overflow-hidden">
      <Sparkles className="h-3 w-3 shrink-0 text-phantom-purple" />
      <span className="truncate">
        {title} {t("referral.withOurCode")}
      </span>
    </span>
  );
}
