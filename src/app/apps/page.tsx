"use client";

import { useState, useMemo } from "react";
import { apps } from "@/lib/data/apps";
import { AppCard } from "@/components/apps/AppCard";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SearchBar } from "@/components/shared/SearchBar";
import { Badge } from "@/components/ui/badge";
import type { Category, Platform } from "@/types";

const filters: { key: Category | Platform | "all"; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "passive", label: "Revenus passifs" },
  { key: "surveys", label: "Sondages" },
  { key: "sms", label: "SMS" },
  { key: "android", label: "Android" },
  { key: "ios", label: "iOS" },
  { key: "windows", label: "Windows" },
];

export default function AppsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return apps;
    return apps.filter(
      (app) =>
        app.categories.includes(activeFilter as Category) ||
        app.platforms.includes(activeFilter as Platform)
    );
  }, [activeFilter]);

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
              Applications
            </h1>
            <p className="text-phantom-gray text-lg max-w-2xl mx-auto">
              Découvrez toutes les applications de revenus passifs testées et approuvées par notre équipe.
            </p>
          </div>
        </ScrollReveal>

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
          {filtered.map((app, i) => (
            <ScrollReveal key={app.id} delay={i * 0.05}>
              <AppCard app={app} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
