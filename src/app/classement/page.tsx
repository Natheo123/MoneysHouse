"use client";

import { useState, useMemo, useEffect } from "react";
import { apps, getTopByEarnings, getEasiestApps } from "@/lib/data/apps";
import { getAllRatingStats } from "@/lib/reviews";
import { AppCard } from "@/components/apps/AppCard";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { Badge } from "@/components/ui/badge";
import type { App, Category, Platform } from "@/types";

type Tab = "earnings" | "easy" | "rating";

const platformFilters: Platform[] = ["android", "ios", "windows", "linux"];
const categoryFilters: Category[] = ["passive", "surveys", "sms"];

export default function ClassementPage() {
  const [tab, setTab] = useState<Tab>("earnings");
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const [ratingStats, setRatingStats] = useState<ReturnType<typeof getAllRatingStats>>({});

  useEffect(() => {
    setRatingStats(getAllRatingStats());
  }, []);

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

  const tabs: { key: Tab; label: string }[] = [
    { key: "earnings", label: "Revenus les plus élevés" },
    { key: "easy", label: "Plus faciles" },
    { key: "rating", label: "Meilleures notes communauté" },
  ];

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <GsapScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
              Classement
            </h1>
            <p className="text-phantom-gray text-lg">
              Les meilleures applications classées par critères
            </p>
          </div>
        </GsapScrollReveal>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}>
              <Badge
                variant={tab === t.key ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
              >
                {t.label}
              </Badge>
            </button>
          ))}
        </div>

        {tab === "rating" && Object.keys(ratingStats).length === 0 && (
          <p className="text-center text-phantom-gray text-sm mb-6">
            Aucun avis communauté pour l&apos;instant. Les notes apparaîtront dès que des utilisateurs laisseront leurs avis.
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <span className="text-sm text-phantom-gray self-center mr-2">Plateforme :</span>
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
          <span className="text-sm text-phantom-gray self-center mr-2">Catégorie :</span>
          {categoryFilters.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}
            >
              <Badge
                variant={categoryFilter === c ? "default" : "outline"}
                className="cursor-pointer"
              >
                {c === "passive" ? "Revenus passifs" : c === "surveys" ? "Sondages" : "SMS"}
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
                <AppCard app={app} />
              </div>
            </GsapScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
