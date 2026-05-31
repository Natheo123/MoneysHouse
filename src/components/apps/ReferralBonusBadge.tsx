"use client";

import { Sparkles } from "lucide-react";
import { useReferrals, hasReferralProgram } from "@/context/ReferralContext";

export function ReferralBonusBadge({ appId }: { appId: string }) {
  const { ready, getReferralBonus } = useReferrals();

  if (!ready || !hasReferralProgram(appId)) return null;

  const bonus = getReferralBonus(appId);
  if (!bonus) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-phantom-dark bg-phantom-purple/25 px-2.5 py-1 rounded-full">
      <Sparkles className="h-3 w-3 text-phantom-purple" />
      {bonus.title} avec notre code
    </span>
  );
}
