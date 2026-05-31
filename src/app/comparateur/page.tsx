"use client";

import { useState } from "react";
import { apps } from "@/lib/data/apps";
import { getAppRatingStats } from "@/lib/reviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { formatEarnings } from "@/lib/utils";
import { AppLogo } from "@/components/icons/AppLogo";
import { ReferralDownloadButton } from "@/components/apps/ReferralDownloadButton";
import { X } from "lucide-react";
import Link from "next/link";

const platformLabels: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  windows: "Windows",
  linux: "Linux",
  web: "Web",
};

export default function ComparateurPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleApp = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const selectedApps = apps.filter((a) => selected.includes(a.id));

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <GsapScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
              Comparateur
            </h1>
            <p className="text-phantom-gray text-lg">
              Comparez jusqu&apos;à 3 applications côte à côte
            </p>
          </div>
        </GsapScrollReveal>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {apps.map((app) => (
            <button key={app.id} onClick={() => toggleApp(app.id)}>
              <Badge
                variant={selected.includes(app.id) ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm flex items-center gap-2"
              >
                <AppLogo appId={app.id} size={20} />
                {app.name}
                {selected.includes(app.id) && <X className="h-3 w-3" />}
              </Badge>
            </button>
          ))}
        </div>

        {selectedApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-4 text-phantom-gray font-medium">Critère</th>
                  {selectedApps.map((app) => (
                    <th key={app.id} className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AppLogo appId={app.id} size={40} />
                        <span className="font-semibold text-phantom-dark">{app.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Revenus",
                    values: selectedApps.map(
                      (a) => a.earningsLabel || formatEarnings(a.earningsMin, a.earningsMax)
                    ),
                  },
                  {
                    label: "Difficulté",
                    values: selectedApps.map((a) => a.difficultyLabel),
                  },
                  {
                    label: "Note communauté",
                    values: selectedApps.map((a) => {
                      const s = getAppRatingStats(a.id);
                      return s.count > 0
                        ? `${s.average}/5 (${s.count} avis)`
                        : "Aucun avis";
                    }),
                  },
                  {
                    label: "Plateformes",
                    values: selectedApps.map((a) =>
                      a.platforms.map((p) => platformLabels[p]).join(", ")
                    ),
                  },
                  {
                    label: "Fonctionnement",
                    values: selectedApps.map((a) => a.shortDescription),
                  },
                  {
                    label: "Liens",
                    values: selectedApps.map((a) =>
                      a.downloadLinks.map((l) => l.label).join(", ")
                    ),
                  },
                ].map((row) => (
                  <tr key={row.label} className="border-t border-phantom-dark/5">
                    <td className="p-4 font-medium text-phantom-dark">{row.label}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className="p-4 text-center text-phantom-gray text-sm">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-phantom-dark/5">
                  <td className="p-4 font-medium text-phantom-dark">Télécharger</td>
                  {selectedApps.map((app) => (
                    <td key={app.id} className="p-4 text-center">
                      <div className="flex flex-col gap-2 items-center">
                        {app.downloadLinks.slice(0, 2).map((link) => (
                          <ReferralDownloadButton
                            key={link.url}
                            app={app}
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
                  <td className="p-4" />
                  {selectedApps.map((app) => (
                    <td key={app.id} className="p-4 text-center">
                      <Link href={`/apps/${app.slug}`}>
                        <Button size="sm">Voir la fiche</Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 rounded-[32px] bg-phantom-surface border border-phantom-dark/5">
            <p className="text-phantom-gray text-lg">
              Sélectionnez des applications ci-dessus pour les comparer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
