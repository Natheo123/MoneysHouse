"use client";

import type { ReactNode } from "react";
import type { App } from "@/types";
import { ExternalLink, Smartphone, Monitor, Globe, UserPlus } from "lucide-react";
import { ReferralDownloadButton } from "@/components/apps/ReferralDownloadButton";

const iconByPlatform: Record<string, ReactNode> = {
  signup: <UserPlus className="h-4 w-4" />,
  android: <Smartphone className="h-4 w-4" />,
  ios: <Smartphone className="h-4 w-4" />,
  windows: <Monitor className="h-4 w-4" />,
  linux: <Monitor className="h-4 w-4" />,
  web: <Globe className="h-4 w-4" />,
};

export function AppDownloadLinks({ app }: { app: App }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-phantom-dark mb-4">
        Télécharger & utiliser
      </h2>
      <p className="text-phantom-gray mb-6 text-sm">
        Liens officiels vers les stores et le site de {app.name}. Une fenêtre vous rappellera
        d&apos;utiliser le code ou le lien de parrainage avant chaque téléchargement.
      </p>
      <div className="flex flex-wrap gap-3">
        {app.downloadLinks.map((link) => (
          <ReferralDownloadButton
            key={link.url + link.label}
            app={app}
            link={link}
            variant={link.platform === "signup" ? "default" : "outline"}
            className="gap-2"
          >
            {iconByPlatform[link.platform] ?? <ExternalLink className="h-4 w-4" />}
            {link.label}
            <ExternalLink className="h-3 w-3 opacity-50" />
          </ReferralDownloadButton>
        ))}
      </div>
    </section>
  );
}
