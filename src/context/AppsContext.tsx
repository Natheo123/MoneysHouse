"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apps as staticApps } from "@/lib/data/apps";
import type { StoredCustomApp } from "@/lib/custom-apps-shared";
import type { App } from "@/types";

export const APPS_UPDATED_EVENT = "moneys-house-apps-updated";

interface AppsContextType {
  ready: boolean;
  apps: App[];
  customApps: StoredCustomApp[];
  refreshApps: () => Promise<void>;
  getAppBySlug: (slug: string) => App | undefined;
  getFeaturedApps: () => App[];
  getTopByEarnings: () => App[];
  getEasiestApps: () => App[];
  upsertCustomApp: (
    app: StoredCustomApp,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
  removeCustomApp: (appId: string, requestedBy: string) => Promise<{ ok: boolean; error?: string }>;
  researchApp: (
    url: string,
    name: string,
    requestedBy: string
  ) => Promise<
    | { ok: true; draft: StoredCustomApp; hints: string[] }
    | { ok: false; error?: string }
  >;
}

const AppsContext = createContext<AppsContextType | undefined>(undefined);

function mergeApps(custom: StoredCustomApp[]): App[] {
  const staticIds = new Set(staticApps.map((a) => a.id));
  const staticSlugs = new Set(staticApps.map((a) => a.slug));
  const extra = custom.filter((c) => !staticIds.has(c.id) && !staticSlugs.has(c.slug));
  return [...staticApps, ...extra];
}

export function AppsProvider({ children }: { children: ReactNode }) {
  const [customApps, setCustomApps] = useState<StoredCustomApp[]>([]);
  const [ready, setReady] = useState(false);

  const refreshApps = useCallback(async () => {
    try {
      const res = await fetch("/api/apps?custom=1", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { apps?: StoredCustomApp[] };
        setCustomApps(Array.isArray(data.apps) ? data.apps : []);
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshApps();
  }, [refreshApps]);

  const apps = useMemo(() => mergeApps(customApps), [customApps]);

  const getAppBySlug = useCallback((slug: string) => apps.find((a) => a.slug === slug), [apps]);

  const getFeaturedApps = useCallback(() => apps.filter((a) => a.featured), [apps]);

  const getTopByEarnings = useCallback(() => {
    return [...apps].sort((a, b) => (b.earningsMax ?? 0) - (a.earningsMax ?? 0));
  }, [apps]);

  const getEasiestApps = useCallback(() => {
    const order = { "very-easy": 0, easy: 1, medium: 2, hard: 3 };
    return [...apps].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  }, [apps]);

  const notify = () => window.dispatchEvent(new Event(APPS_UPDATED_EVENT));

  const upsertCustomApp = useCallback(
    async (app: StoredCustomApp, requestedBy: string) => {
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upsert", app, requestedBy }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; apps?: StoredCustomApp[] };
      if (data.ok && data.apps) {
        setCustomApps(data.apps);
        notify();
      }
      return { ok: data.ok, error: data.error };
    },
    []
  );

  const removeCustomApp = useCallback(async (appId: string, requestedBy: string) => {
    const res = await fetch("/api/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", appId, requestedBy }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string; apps?: StoredCustomApp[] };
    if (data.ok && data.apps) {
      setCustomApps(data.apps);
      notify();
    }
    return { ok: data.ok, error: data.error };
  }, []);

  const researchApp = useCallback(async (url: string, name: string, requestedBy: string) => {
    const res = await fetch("/api/apps/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, name, requestedBy }),
    });
    return (await res.json()) as
      | { ok: true; draft: StoredCustomApp; hints: string[] }
      | { ok: false; error?: string };
  }, []);

  const value = useMemo(
    () => ({
      ready,
      apps,
      customApps,
      refreshApps,
      getAppBySlug,
      getFeaturedApps,
      getTopByEarnings,
      getEasiestApps,
      upsertCustomApp,
      removeCustomApp,
      researchApp,
    }),
    [
      ready,
      apps,
      customApps,
      refreshApps,
      getAppBySlug,
      getFeaturedApps,
      getTopByEarnings,
      getEasiestApps,
      upsertCustomApp,
      removeCustomApp,
      researchApp,
    ]
  );

  return <AppsContext.Provider value={value}>{children}</AppsContext.Provider>;
}

export function useApps() {
  const ctx = useContext(AppsContext);
  if (!ctx) throw new Error("useApps must be used within AppsProvider");
  return ctx;
}
