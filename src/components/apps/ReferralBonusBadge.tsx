"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getReferralBonus, hasReferralProgram, REFERRAL_CODES_UPDATED_EVENT } from "@/lib/referrals";

export function ReferralBonusBadge({ appId }: { appId: string }) {
  const [bonus, setBonus] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!hasReferralProgram(appId)) {
      setBonus(null);
      return;
    }
    const data = getReferralBonus(appId);
    setBonus(data?.title ?? null);
  }, [appId]);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(REFERRAL_CODES_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(REFERRAL_CODES_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  if (!bonus) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-phantom-dark bg-phantom-purple/25 px-2.5 py-1 rounded-full">
      <Sparkles className="h-3 w-3 text-phantom-purple" />
      {bonus} avec notre code
    </span>
  );
}
