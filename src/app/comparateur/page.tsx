"use client";

import { useState, useMemo } from "react";
import { apps } from "@/lib/data/apps";
import { useReviews } from "@/context/ReviewContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { PageShell } from "@/components/layout/PageShell";
import { AppLogo } from "@/components/icons/AppLogo";
import { ReferralDownloadButton } from "@/components/apps/ReferralDownloadButton";
import { X } from "lucide-react";
import Link from "next/link";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import type { App } from "@/types";

const platformLabels: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  windows: "Windows",
  linux: "Linux",
  web: "Web",
};

function useComparisonRows(
  selectedApps: App[],
  t: (key: string, params?: Record<string, string | number>) => string,
  formatEarnings: (min?: number, max?: number) => string,
  getAppRatingStats: (appId: string) => { average: number; count: number }
) {
  return useMemo(
    () => [
      {
        label: t("compare.rowEarnings"),
        values: selectedApps.map(
          (a) => a.earningsLabel || formatEarnings(a.earningsMin, a.earningsMax)
        ),
      },
      {
        label: t("compare.rowDifficulty"),
        values: selectedApps.map((a) => a.difficultyLabel),
      },
      {
        label: t("compare.rowRating"),
        values: selectedApps.map((a) => {
          const s = getAppRatingStats(a.id);
          return s.count > 0
            ? `${s.average}/5 (${s.count} ${t("apps.reviews")})`
            : t("compare.noReviews");
        }),
      },
      {
        label: t("compare.rowPlatforms"),
        values: selectedApps.map((a) =>
          a.platforms.map((p) => platformLabels[p]).join(", ")
        ),
      },
      {
        label: t("compare.rowHow"),
        values: selectedApps.map((a) => a.shortDescription),
      },
      {
        label: t("compare.rowLinks"),
        values: selectedApps.map((a) => a.downloadLinks.map((l) => l.label).join(", ")),
      },
    ],
    [selectedApps, t, formatEarnings, getAppRatingStats]
  );
}

type ComparisonRow = { label: string; values: string[] };

function MobileCompareCards({
  selectedApps,
  rows,
  t,
}: {
  selectedApps: App[];
  rows: ComparisonRow[];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <div className="md:hidden space-y-6">
      {selectedApps.map((app, appIndex) => (
        <article
          key={app.id}
          className="rounded-[28px] bg-phantom-surface border border-phantom-dark/5 p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-phantom-dark/5">
            <AppLogo appId={app.id} size={44} />
            <h2 className="text-xl font-semibold text-phantom-dark">{app.name}</h2>
          </div>

          <dl className="space-y-4">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-phantom-gray mb-1">
                  {row.label}
                </dt>
                <dd className="text-sm text-phantom-dark break-words">{row.values[appIndex]}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 pt-4 border-t border-phantom-dark/5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-phantom-gray">
              {t("compare.download")}
            </p>
            <div className="flex flex-col gap-2">
              {app.downloadLinks.slice(0, 2).map((link) => (
                <ReferralDownloadButton
                  key={link.url}
                  app={apps.find((a) => a.id === app.id) ?? app}
                  link={link}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  {link.label}
                </ReferralDownloadButton>
              ))}
            </div>
            <Link href={`/apps/${app.slug}`} className="block">
              <Button size="sm" className="w-full">
                {t("common.seeAppDetails")}
              </Button>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function ComparateurPage() {
  const { t } = useTranslation();
  const { getLocalizedApp, formatEarnings } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleApp = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const selectedApps = selected
    .map((id) => apps.find((a) => a.id === id))
    .filter(Boolean)
    .map((app) => getLocalizedApp(app!));

  const { getAppRatingStats } = useReviews();
  const rows = useComparisonRows(selectedApps, t, formatEarnings, getAppRatingStats);

  return (
    <PageShell>
      <GsapScrollReveal>
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
            {t("compare.title")}
          </h1>
          <p className="text-phantom-gray text-base sm:text-lg">
            {t("compare.subtitle")}
          </p>
        </div>
      </GsapScrollReveal>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
        {apps.map((app) => {
          const displayApp = getLocalizedApp(app);
          return (
            <button key={app.id} onClick={() => toggleApp(app.id)} type="button">
              <Badge
                variant={selected.includes(app.id) ? "default" : "outline"}
                className="cursor-pointer px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center gap-2 max-w-full"
              >
                <AppLogo appId={app.id} size={20} />
                <span className="truncate max-w-[120px] sm:max-w-none">{displayApp.name}</span>
                {selected.includes(app.id) && <X className="h-3 w-3 shrink-0" />}
              </Badge>
            </button>
          );
        })}
      </div>

      {selectedApps.length > 0 ? (
        <>
          <MobileCompareCards selectedApps={selectedApps} rows={rows} t={t} />

          <div className="hidden md:block overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left p-3 sm:p-4 text-phantom-gray font-medium" />
                  {selectedApps.map((app) => (
                    <th key={app.id} className="p-3 sm:p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AppLogo appId={app.id} size={40} />
                        <span className="font-semibold text-phantom-dark">{app.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-phantom-dark/5">
                    <td className="p-3 sm:p-4 font-medium text-phantom-dark align-top">{row.label}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className="p-3 sm:p-4 text-center text-phantom-gray text-sm break-words align-top">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-phantom-dark/5">
                  <td className="p-3 sm:p-4 font-medium text-phantom-dark align-top">{t("compare.download")}</td>
                  {selectedApps.map((app) => (
                    <td key={app.id} className="p-3 sm:p-4 text-center align-top">
                      <div className="flex flex-col gap-2 items-center">
                        {app.downloadLinks.slice(0, 2).map((link) => (
                          <ReferralDownloadButton
                            key={link.url}
                            app={apps.find((a) => a.id === app.id) ?? app}
                            link={link}
                            size="sm"
                            variant="outline"
                          >
                            {link.label}
                          </ReferralDownloadButton>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-phantom-dark/5">
                  <td className="p-3 sm:p-4" />
                  {selectedApps.map((app) => (
                    <td key={app.id} className="p-3 sm:p-4 text-center">
                      <Link href={`/apps/${app.slug}`}>
                        <Button size="sm">{t("common.seeAppDetails")}</Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-16 sm:py-20 rounded-[28px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5 px-4">
          <p className="text-phantom-gray text-base sm:text-lg">
            {t("compare.selectApps")}
          </p>
        </div>
      )}
    </PageShell>
  );
}
