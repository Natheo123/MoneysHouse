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
import type { ProofEntry, ProofsData } from "@/lib/proofs-shared";

interface ProofContextType {
  ready: boolean;
  proofs: ProofsData;
  refreshProofs: () => Promise<void>;
  getProofsForApp: (appId: string) => ProofEntry[];
  getProofCount: (appId: string) => number;
  addProof: (
    appId: string,
    file: File,
    caption: string,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
  removeProof: (
    appId: string,
    proofId: string,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
}

const ProofContext = createContext<ProofContextType | undefined>(undefined);

export function ProofProvider({ children }: { children: ReactNode }) {
  const [proofs, setProofs] = useState<ProofsData>({});
  const [ready, setReady] = useState(false);

  const refreshProofs = useCallback(async () => {
    try {
      const res = await fetch("/api/proofs", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { proofs?: ProofsData };
      setProofs(data.proofs ?? {});
    } catch {
      // ignore
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refreshProofs();
  }, [refreshProofs]);

  const getProofsForApp = useCallback(
    (appId: string) => proofs[appId] ?? [],
    [proofs]
  );

  const getProofCount = useCallback(
    (appId: string) => proofs[appId]?.length ?? 0,
    [proofs]
  );

  const addProof = useCallback(
    async (appId: string, file: File, caption: string, requestedBy: string) => {
      const formData = new FormData();
      formData.set("appId", appId);
      formData.set("file", file);
      formData.set("caption", caption);
      formData.set("requestedBy", requestedBy);

      const res = await fetch("/api/proofs", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; proofs?: ProofEntry[] };

      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error ?? "Erreur lors de l'envoi." };
      }

      setProofs((prev) => ({
        ...prev,
        [appId]: data.proofs ?? prev[appId] ?? [],
      }));
      return { ok: true };
    },
    []
  );

  const removeProof = useCallback(
    async (appId: string, proofId: string, requestedBy: string) => {
      const res = await fetch("/api/proofs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, proofId, requestedBy }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; proofs?: ProofEntry[] };

      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error ?? "Erreur lors de la suppression." };
      }

      setProofs((prev) => {
        const next = { ...prev };
        if (data.proofs && data.proofs.length > 0) {
          next[appId] = data.proofs;
        } else {
          delete next[appId];
        }
        return next;
      });
      return { ok: true };
    },
    []
  );

  const value = useMemo(
    () => ({
      ready,
      proofs,
      refreshProofs,
      getProofsForApp,
      getProofCount,
      addProof,
      removeProof,
    }),
    [ready, proofs, refreshProofs, getProofsForApp, getProofCount, addProof, removeProof]
  );

  return <ProofContext.Provider value={value}>{children}</ProofContext.Provider>;
}

export function useProofs() {
  const ctx = useContext(ProofContext);
  if (!ctx) throw new Error("useProofs must be used within ProofProvider");
  return ctx;
}
