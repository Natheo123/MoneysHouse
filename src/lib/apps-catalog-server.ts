import "server-only";

import { mergeCatalogApps } from "@/lib/apps-merge";
import { getCustomAppsServer } from "@/lib/custom-apps-store";
import { getHiddenAppIdsServer } from "@/lib/hidden-apps-store";
import type { App } from "@/types";

export async function getAllAppsServer(): Promise<App[]> {
  const [custom, hiddenIds] = await Promise.all([
    getCustomAppsServer(),
    getHiddenAppIdsServer(),
  ]);
  return mergeCatalogApps(custom, hiddenIds);
}

export async function getAppBySlugServer(slug: string): Promise<App | undefined> {
  const all = await getAllAppsServer();
  return all.find((a) => a.slug === slug);
}
