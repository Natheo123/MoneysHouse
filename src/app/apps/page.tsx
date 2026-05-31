"use client";

import { useState, useMemo } from "react";
import { AppCard } from "@/components/apps/AppCard";
import { PageShell } from "@/components/layout/PageShell";
import { SearchBar } from "@/components/shared/SearchBar";
import { Badge } from "@/components/ui/badge";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import type { Category, Platform } from "@/types";

export default function AppsPage() {
  const { t } = useTranslation();
  const { localizedApps } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters: { key: Category | Platform | "all"; label: string }[] = [
    { key: "all", label: t("apps.filterAll") },
    { key: "passive", label: t("apps.filterPassive") },
    { key: "surveys", label: t("apps.filterSurveys") },
    { key: "games", label: t("apps.filterGames") },
    { key: "sms", label: t("apps.filterSms") },
    { key: "android", label: "Android" },
    { key: "ios", label: "iOS" },
    { key: "windows", label: "Windows" },
  ];

  const filtered = useMemo(() => {
    if (activeFilter === "all") return localizedApps;
    return localizedApps.filter(
      (app) =>
        app.categories.includes(activeFilter as Category) ||
        app.platforms.includes(activeFilter as Platform)
    );
  }, [activeFilter, localizedApps]);

  return (
    <PageShell>
      <GsapScrollReveal>
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
            {t("apps.title")}
          </h1>
          <p className="text-phantom-gray text-base sm:text-lg max-w-2xl mx-auto px-2">
            {t("apps.subtitle")}
          </p>
        </div>
      </GsapScrollReveal>

      <div className="max-w-xl mx-auto mb-8">
        <SearchBar />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setActiveFilter(f.key)}>
            <Badge
              variant={activeFilter === f.key ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-phantom-purple/30 transition-colors"
            >
              {f.label}
            </Badge>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((app) => (
          <GsapScrollReveal key={app.id}>
            <AppCard app={app} />
          </GsapScrollReveal>
        ))}
      </div>
    </PageShell>
  );
}
