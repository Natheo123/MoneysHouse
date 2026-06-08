import { apps as staticApps } from "@/lib/data/apps";
import { getCustomAppsServer } from "@/lib/custom-apps-store";
import type { App } from "@/types";

export async function getAllAppsServer(): Promise<App[]> {
  const custom = await getCustomAppsServer();
  const staticIds = new Set(staticApps.map((a) => a.id));
  const staticSlugs = new Set(staticApps.map((a) => a.slug));
  const extra = custom.filter((c) => !staticIds.has(c.id) && !staticSlugs.has(c.slug));
  return [...staticApps, ...extra];
}

export async function getAppBySlugServer(slug: string): Promise<App | undefined> {
  const all = await getAllAppsServer();
  return all.find((a) => a.slug === slug);
}

export function getFeaturedAppsFromList(list: App[]): App[] {
  return list.filter((a) => a.featured);
}

export function getTopByEarningsFromList(list: App[]): App[] {
  return [...list].sort((a, b) => (b.earningsMax ?? 0) - (a.earningsMax ?? 0));
}

export function getEasiestAppsFromList(list: App[]): App[] {
  const order = { "very-easy": 0, easy: 1, medium: 2, hard: 3 };
  return [...list].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
}
