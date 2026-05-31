"use client";

import Image from "next/image";
import { useState } from "react";
import { apps } from "@/lib/data/apps";
import { buildAppLogoUrl, buildPlayStoreLogoUrl, getPlayStorePackageId } from "@/lib/app-logos";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  appId: string;
  size?: number;
  className?: string;
}

function getLogoCandidates(appId: string): string[] {
  const app = apps.find((a) => a.id === appId);
  if (!app) return [];

  const candidates: string[] = [];
  if (app.logoUrl) candidates.push(app.logoUrl);

  const androidUrl = app.downloadLinks.find((l) => l.platform === "android")?.url;
  if (androidUrl) {
    const packageId = getPlayStorePackageId(androidUrl);
    if (packageId) candidates.push(buildPlayStoreLogoUrl(packageId));
    candidates.push(buildAppLogoUrl(androidUrl));
  }

  const iosUrl = app.downloadLinks.find((l) => l.platform === "ios")?.url;
  if (iosUrl) candidates.push(buildAppLogoUrl(iosUrl));

  const signupUrl = app.downloadLinks.find((l) => l.platform === "signup")?.url;
  if (signupUrl) candidates.push(buildAppLogoUrl(signupUrl));

  return [...new Set(candidates)];
}

export function AppLogo({ appId, size = 32, className }: AppLogoProps) {
  const app = apps.find((a) => a.id === appId);
  const candidates = getLogoCandidates(appId);
  const [index, setIndex] = useState(0);

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
