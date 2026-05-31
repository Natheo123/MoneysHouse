"use client";

import { useState, useMemo, useEffect } from "react";
import { apps, getTopByEarnings, getEasiestApps } from "@/lib/data/apps";
import { useReviews, REVIEWS_UPDATED_EVENT } from "@/context/ReviewContext";
import { AppCard } from "@/components/apps/AppCard";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/badge";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import type { Category, Platform } from "@/types";

type Tab = "earnings" | "easy" | "rating";

const platformFilters: Platform[] = ["android", "ios", "windows", "linux"];
const categoryFilters: Category[] = ["passive", "surveys", "games", "sms"];

const categoryLabelKeys: Partial<Record<Category, string>> = {
  passive: "apps.filterPassive",
  surveys: "apps.filterSurveys",
  games: "apps.filterGames",
  sms: "apps.filterSms",
  bandwidth: "apps.filterPassive",
};

export default function ClassementPage() {
  const { t } = useTranslation();
  const { localizedApps } = useLanguage();
  const { getAllRatingStats, refreshReviews } = useReviews();
  const [tab, setTab] = useState<Tab>("earnings");
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const [ratingStats, setRatingStats] = useState<ReturnType<typeof getAllRatingStats>>({});

  useEffect(() => {
    setRatingStats(getAllRatingStats());
  }, [getAllRatingStats]);

  useEffect(() => {
    const onUpdate = () => {
      refreshReviews();
      setRatingStats(getAllRatingStats());
    };
    window.addEventListener(REVIEWS_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(REVIEWS_UPDATED_EVENT, onUpdate);
  }, [getAllRatingStats, refreshReviews]);

  const ranked = useMemo(() => {
    if (tab === "earnings") return getTopByEarnings();
    if (tab === "easy") return getEasiestApps();
    return [...apps].sort((a, b) => {
      const ra = ratingStats[a.id]?.average ?? 0;
      const rb = ratingStats[b.id]?.average ?? 0;
      if (rb !== ra) return rb - ra;
      return (ratingStats[b.id]?.count ?? 0) - (ratingStats[a.id]?.count ?? 0);
    });
  }, [tab, ratingStats]);

  const filtered = ranked.filter((app) => {
    if (platformFilter && !app.platforms.includes(platformFilter)) return false;
    if (categoryFilter && !app.categories.includes(categoryFilter)) return false;
    return true;
  });

  const tabs: { key: Tab; labelKey: string }[] = [
    { key: "earnings", labelKey: "ranking.tabEarnings" },
    { key: "easy", labelKey: "ranking.tabEasy" },
    { key: "rating", labelKey: "ranking.tabRating" },
  ];

  return (
    <PageShell>
        <GsapScrollReveal>
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
              {t("ranking.title")}
            </h1>
            <p className="text-phantom-gray text-base sm:text-lg">
              {t("ranking.subtitle")}
            </p>
          </div>
        </GsapScrollReveal>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tabItem) => (
            <button key={tabItem.key} onClick={() => setTab(tabItem.key)}>
              <Badge
                variant={tab === tabItem.key ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
              >
                {t(tabItem.labelKey)}
              </Badge>
            </button>
          ))}
        </div>

        {tab === "rating" && Object.keys(ratingStats).length === 0 && (
          <p className="text-center text-phantom-gray text-sm mb-6">
            {t("ranking.noRatingsYet")}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <span className="text-sm text-phantom-gray self-center mr-2">{t("ranking.platform")} :</span>
          {platformFilters.map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(platformFilter === p ? null : p)}
            >
              <Badge
                variant={platformFilter === p ? "default" : "outline"}
                className="cursor-pointer capitalize"
              >
                {p}
              </Badge>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <span className="text-sm text-phantom-gray self-center mr-2">{t("ranking.category")} :</span>
          {categoryFilters.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}
            >
              <Badge
                variant={categoryFilter === c ? "default" : "outline"}
                className="cursor-pointer"
              >
                {t(categoryLabelKeys[c] ?? "apps.filterAll")}
              </Badge>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((app, i) => (
            <GsapScrollReveal key={app.id} delay={i * 0.05}>
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-phantom-purple flex items-center justify-center text-phantom-dark font-bold z-10">
                  #{i + 1}
                </div>
                <AppCard app={localizedApps.find((a) => a.id === app.id) ?? app} />
              </div>
            </GsapScrollReveal>
          ))}
        </div>
    </PageShell>
  );
}
