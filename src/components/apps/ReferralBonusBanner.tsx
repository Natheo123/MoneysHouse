"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getReferralBonus, hasReferralProgram, REFERRAL_CODES_UPDATED_EVENT } from "@/lib/referrals";
import type { App } from "@/types";

export function ReferralBonusBanner({ app }: { app: App }) {
  const [bonus, setBonus] = useState<{ title: string; description: string } | null>(null);

  const refresh = useCallback(() => {
    if (!hasReferralProgram(app.id)) {
      setBonus(null);
      return;
    }
    setBonus(getReferralBonus(app.id));
  }, [app.id]);

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
    <div
      className="rounded-[24px] p-5 mb-6 border border-white/30"
      style={{
        background: `linear-gradient(135deg, ${app.color}50 0%, ${app.color}15 100%)`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-phantom-dark flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-phantom-purple" />
        </div>
        <div>
          <p className="text-xs font-semibold text-phantom-dark/70 uppercase tracking-wide mb-1">
            Offre parrainage Money&apos;s House
          </p>
          <p className="text-xl font-bold text-phantom-dark mb-1">{bonus.title}</p>
          <p className="text-sm text-phantom-dark/75">{bonus.description}</p>
        </div>
      </div>
    </div>
  );
}
