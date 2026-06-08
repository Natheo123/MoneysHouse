"use client";

import Link from "next/link";
import { useRef, useLayoutEffect } from "react";
import { Star, Heart, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import type { App } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { AppLogo } from "@/components/icons/AppLogo";
import { ReferralBonusBadge } from "@/components/apps/ReferralBonusBadge";
import { useProofs } from "@/context/ProofContext";
import { useAppReviews } from "@/hooks/useAppReviews";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

const platformLabels: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  windows: "Windows",
  linux: "Linux",
  web: "Web",
};

interface AppCardProps {
  app: App;
  showFavorite?: boolean;
}

export function AppCard({ app, showFavorite = true }: AppCardProps) {
  const { t } = useTranslation();
  const { getLocalizedApp, formatEarnings } = useLanguage();
  const localizedApp = getLocalizedApp(app);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useUser();
  const { stats } = useAppReviews(app.id);
  const { getProofCount } = useProofs();
  const proofCount = getProofCount(app.id);
  const favorite = isFavorite(app.id);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const enter = () =>
      gsap.to(el, { y: -6, duration: 0.3, ease: "power2.out" });
    const leave = () =>
      gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={cardRef} className="min-w-0 w-full h-full">
      <Card className="overflow-hidden h-full w-full min-w-0 flex flex-col group">
        <CardContent className="p-5 sm:p-6 flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-14 h-14 rounded-[20px] flex items-center justify-center"
              style={{ backgroundColor: `${app.color}40` }}
            >
              <AppLogo appId={app.id} size={36} />
            </div>
            {showFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(app.id);
                }}
                className="p-2 rounded-full hover:bg-phantom-lavender/50 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${favorite ? "fill-phantom-purple text-phantom-purple" : "text-phantom-gray"}`}
                />
              </button>
            )}
          </div>
          <h3 className="text-xl font-semibold text-phantom-dark mb-2 break-words">{localizedApp.name}</h3>
          <div className="mb-2 min-w-0 w-full">
            <ReferralBonusBadge appId={localizedApp.id} />
          </div>
          <p className="text-phantom-gray text-sm mb-4 flex-1 break-words">{localizedApp.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">
              {localizedApp.earningsMin != null || localizedApp.earningsMax != null
                ? formatEarnings(localizedApp.earningsMin, localizedApp.earningsMax)
                : localizedApp.earningsLabel || formatEarnings(localizedApp.earningsMin, localizedApp.earningsMax)}
            </Badge>
            <Badge variant="outline">{localizedApp.difficultyLabel}</Badge>
            {proofCount > 0 && (
              <Badge variant="outline" className="border-green-500/30 text-green-700">
                {proofCount} {proofCount > 1 ? t("apps.proofs") : t("apps.proof")}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {localizedApp.platforms.map((p) => (
              <span key={p} className="text-xs text-phantom-gray bg-phantom-bg px-2 py-1 rounded-full">
                {platformLabels[p]}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {stats.count > 0 ? (
              <div className="flex items-center gap-1 min-w-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                <span className="text-sm font-medium text-phantom-dark">{stats.average}</span>
                <span className="text-xs text-phantom-gray">({stats.count} {t("apps.reviews")})</span>
              </div>
            ) : (
              <span className="text-xs text-phantom-gray">{t("apps.noReviews")}</span>
            )}
            <Link href={`/apps/${localizedApp.slug}`} className="w-full sm:w-auto">
              <Button size="sm" variant="default" className="w-full sm:w-auto">
                {t("apps.discover")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
