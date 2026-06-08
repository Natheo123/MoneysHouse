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
import type { Partner } from "@/lib/partners-shared";

export const PARTNERS_UPDATED_EVENT = "moneys-house-partners-updated";

interface PartnersContextType {
  ready: boolean;
  partners: Partner[];
  refreshPartners: () => Promise<void>;
  upsertPartner: (
    partner: Partner,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
  removePartner: (
    partnerId: string,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
}

const PartnersContext = createContext<PartnersContextType | undefined>(undefined);

export function PartnersProvider({ children }: { children: ReactNode }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [ready, setReady] = useState(false);

  const refreshPartners = useCallback(async () => {
    try {
      const res = await fetch("/api/partners", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { partners?: Partner[] };
        setPartners(Array.isArray(data.partners) ? data.partners : []);
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshPartners();
  }, [refreshPartners]);

  const notify = () => window.dispatchEvent(new Event(PARTNERS_UPDATED_EVENT));

  const upsertPartner = useCallback(async (partner: Partner, requestedBy: string) => {
    const res = await fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upsert", partner, requestedBy }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string; partners?: Partner[] };
    if (data.ok && data.partners) {
      setPartners(data.partners);
      notify();
    }
    return { ok: data.ok, error: data.error };
  }, []);

  const removePartner = useCallback(async (partnerId: string, requestedBy: string) => {
    const res = await fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", partnerId, requestedBy }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string; partners?: Partner[] };
    if (data.ok && data.partners) {
      setPartners(data.partners);
      notify();
    }
    return { ok: data.ok, error: data.error };
  }, []);

  const value = useMemo(
    () => ({
      ready,
      partners,
      refreshPartners,
      upsertPartner,
      removePartner,
    }),
    [ready, partners, refreshPartners, upsertPartner, removePartner]
  );

  return <PartnersContext.Provider value={value}>{children}</PartnersContext.Provider>;
}

export function usePartners() {
  const ctx = useContext(PartnersContext);
  if (!ctx) throw new Error("usePartners must be used within PartnersProvider");
  return ctx;
}
