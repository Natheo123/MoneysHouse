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
import { mergeCatalogApps, resolveAppById } from "@/lib/apps-merge";
import type { StoredCustomApp } from "@/lib/custom-apps-shared";
import type { App } from "@/types";

export const APPS_UPDATED_EVENT = "moneys-house-apps-updated";

interface AppsContextType {
  ready: boolean;
  apps: App[];
  customApps: StoredCustomApp[];
  hiddenAppIds: string[];
  hiddenApps: App[];
  refreshApps: () => Promise<void>;
  getAppBySlug: (slug: string) => App | undefined;
  getFeaturedApps: () => App[];
  getTopByEarnings: () => App[];
  getEasiestApps: () => App[];
  upsertCustomApp: (
    app: StoredCustomApp,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
  deleteApp: (appId: string, requestedBy: string) => Promise<{ ok: boolean; error?: string }>;
  restoreApp: (appId: string, requestedBy: string) => Promise<{ ok: boolean; error?: string }>;
  requestDiscordPublish: (
    appId: string,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
  researchApp: (
    url: string,
    name: string,
    requestedBy: string
  ) => Promise<
    | { ok: true; draft: StoredCustomApp; hints: string[] }
    | { ok: false; error?: string }
  >;
  isCustomApp: (appId: string) => boolean;
}

const AppsContext = createContext<AppsContextType | undefined>(undefined);

type CatalogPayload = {
  apps?: StoredCustomApp[];
  hiddenIds?: string[];
};

function applyCatalogPayload(
  data: CatalogPayload,
  setCustomApps: (apps: StoredCustomApp[]) => void,
  setHiddenAppIds: (ids: string[]) => void
) {
  if (Array.isArray(data.apps)) setCustomApps(data.apps);
  if (Array.isArray(data.hiddenIds)) setHiddenAppIds(data.hiddenIds);
}

export function AppsProvider({ children }: { children: ReactNode }) {
  const [customApps, setCustomApps] = useState<StoredCustomApp[]>([]);
  const [hiddenAppIds, setHiddenAppIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const refreshApps = useCallback(async () => {
    try {
      const res = await fetch("/api/apps?custom=1", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as CatalogPayload;
        applyCatalogPayload(data, setCustomApps, setHiddenAppIds);
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshApps();
  }, [refreshApps]);

  const apps = useMemo(
    () => mergeCatalogApps(customApps, hiddenAppIds),
    [customApps, hiddenAppIds]
  );

  const hiddenApps = useMemo(
    () =>
      hiddenAppIds
        .map((id) => resolveAppById(id, customApps))
        .filter((app): app is App => Boolean(app)),
    [hiddenAppIds, customApps]
  );

  const isCustomApp = useCallback(
    (appId: string) => customApps.some((app) => app.id === appId),
    [customApps]
  );

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

  const upsertCustomApp = useCallback(async (app: StoredCustomApp, requestedBy: string) => {
    const res = await fetch("/api/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upsert", app, requestedBy }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string } & CatalogPayload;
    if (data.ok) {
      applyCatalogPayload(data, setCustomApps, setHiddenAppIds);
      notify();
    }
    return { ok: data.ok, error: data.error };
  }, []);

  const deleteApp = useCallback(async (appId: string, requestedBy: string) => {
    const res = await fetch("/api/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", appId, requestedBy }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string } & CatalogPayload;
    if (data.ok) {
      applyCatalogPayload(data, setCustomApps, setHiddenAppIds);
      notify();
    }
    return { ok: data.ok, error: data.error };
  }, []);

  const restoreApp = useCallback(async (appId: string, requestedBy: string) => {
    const res = await fetch("/api/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore", appId, requestedBy }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string } & CatalogPayload;
    if (data.ok) {
      applyCatalogPayload(data, setCustomApps, setHiddenAppIds);
      notify();
    }
    return { ok: data.ok, error: data.error };
  }, []);

  const requestDiscordPublish = useCallback(async (appId: string, requestedBy: string) => {
    const res = await fetch("/api/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request-discord", appId, requestedBy }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string } & CatalogPayload;
    if (data.ok) {
      applyCatalogPayload(data, setCustomApps, setHiddenAppIds);
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
      hiddenAppIds,
      hiddenApps,
      refreshApps,
      getAppBySlug,
      getFeaturedApps,
      getTopByEarnings,
      getEasiestApps,
      upsertCustomApp,
      deleteApp,
      restoreApp,
      requestDiscordPublish,
      researchApp,
      isCustomApp,
    }),
    [
      ready,
      apps,
      customApps,
      hiddenAppIds,
      hiddenApps,
      refreshApps,
      getAppBySlug,
      getFeaturedApps,
      getTopByEarnings,
      getEasiestApps,
      upsertCustomApp,
      deleteApp,
      restoreApp,
      requestDiscordPublish,
      researchApp,
      isCustomApp,
    ]
  );

  return <AppsContext.Provider value={value}>{children}</AppsContext.Provider>;
}

export function useApps() {
  const ctx = useContext(AppsContext);
  if (!ctx) throw new Error("useApps must be used within AppsProvider");
  return ctx;
}
