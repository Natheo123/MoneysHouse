"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { apps } from "@/lib/data/apps";
import { getItunesAppId, resolveAppLogoUrls } from "@/lib/app-logos";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  appId: string;
  size?: number;
  className?: string;
}

export function AppLogo({ appId, size = 32, className }: AppLogoProps) {
  const app = apps.find((a) => a.id === appId);
  const baseCandidates = useMemo(
    () => (app ? resolveAppLogoUrls(app) : []),
    [app]
  );
  const [candidates, setCandidates] = useState<string[]>(baseCandidates);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setCandidates(baseCandidates);
    setIndex(0);
  }, [baseCandidates]);

  useEffect(() => {
    if (!app) return;
    if (app.logoUrl?.startsWith("/")) return;

    const iosUrl = app.downloadLinks.find((l) => l.platform === "ios")?.url;
    const itunesId = iosUrl ? getItunesAppId(iosUrl) : null;
    if (!itunesId) return;

    let cancelled = false;
    fetch(`/api/app-icon?appId=${encodeURIComponent(app.id)}`, { cache: "force-cache" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ok?: boolean; url?: string } | null) => {
        if (cancelled || !data?.ok || !data.url) return;
        const artworkUrl = data.url;
        setCandidates((prev) => {
          if (prev[0] === artworkUrl) return prev;
          return [artworkUrl, ...prev.filter((u) => u !== artworkUrl)];
        });
        setIndex(0);
      })
      .catch(() => {
        // garde les favicons du site officiel
      });

    return () => {
      cancelled = true;
    };
  }, [app]);

  const src = candidates[index];

  if (!app || !src || index >= candidates.length) {
    return (
      <div
        className={cn(
          "rounded-[22%] bg-phantom-purple/30 flex items-center justify-center font-bold text-phantom-dark shrink-0",
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        aria-hidden
      >
        {app?.name?.charAt(0) ?? "?"}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`Logo ${app.name}`}
      width={size}
      height={size}
      className={cn("rounded-[22%] object-cover bg-white shrink-0", className)}
      onError={() => setIndex((prev) => prev + 1)}
      unoptimized
    />
  );
}
