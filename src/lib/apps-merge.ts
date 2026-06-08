import { apps as staticApps } from "@/lib/data/apps";
import type { StoredCustomApp } from "@/lib/custom-apps-shared";
import type { App } from "@/types";

export function mergeCatalogApps(
  custom: StoredCustomApp[],
  hiddenIds: string[] = []
): App[] {
  const hidden = new Set(hiddenIds);
  const staticIds = new Set(staticApps.map((a) => a.id));
  const staticSlugs = new Set(staticApps.map((a) => a.slug));
  const extra = custom.filter((c) => !staticIds.has(c.id) && !staticSlugs.has(c.slug));
  return [...staticApps, ...extra].filter((app) => !hidden.has(app.id));
}

export function resolveAppById(
  appId: string,
  custom: StoredCustomApp[]
): App | undefined {
  const id = appId.trim();
  const fromStatic = staticApps.find((a) => a.id === id);
  if (fromStatic) return fromStatic;

  const fromCustom = custom.find((a) => a.id === id);
  if (fromCustom) return fromCustom;

  return undefined;
}

export function isBuiltInApp(appId: string, custom: StoredCustomApp[]): boolean {
  const id = appId.trim();
  if (staticApps.some((a) => a.id === id)) return true;
  return !custom.some((a) => a.id === id);
}
