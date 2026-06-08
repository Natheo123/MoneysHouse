import "server-only";

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
