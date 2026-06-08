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
import { DEFAULT_TIPS_SETTINGS, type TipsSettings } from "@/lib/tips-shared";

export const TIPS_UPDATED_EVENT = "moneys-house-tips-updated";

interface TipsContextType {
  ready: boolean;
  settings: TipsSettings;
  refreshTips: () => Promise<void>;
  updateTips: (
    settings: TipsSettings,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
}

const TipsContext = createContext<TipsContextType | undefined>(undefined);

export function TipsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<TipsSettings>(DEFAULT_TIPS_SETTINGS);
  const [ready, setReady] = useState(false);

  const refreshTips = useCallback(async () => {
    try {
      const res = await fetch("/api/tips", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { settings?: TipsSettings };
        if (data.settings) setSettings(data.settings);
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshTips();
  }, [refreshTips]);

  const notify = () => window.dispatchEvent(new Event(TIPS_UPDATED_EVENT));

  const updateTips = useCallback(async (next: TipsSettings, requestedBy: string) => {
    const res = await fetch("/api/tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: next, requestedBy }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string; settings?: TipsSettings };
    if (data.ok && data.settings) {
      setSettings(data.settings);
      notify();
    }
    return { ok: data.ok, error: data.error };
  }, []);

  const value = useMemo(
    () => ({
      ready,
      settings,
      refreshTips,
      updateTips,
    }),
    [ready, settings, refreshTips, updateTips]
  );

  return <TipsContext.Provider value={value}>{children}</TipsContext.Provider>;
}

export function useTips() {
  const ctx = useContext(TipsContext);
  if (!ctx) throw new Error("useTips must be used within TipsProvider");
  return ctx;
}
