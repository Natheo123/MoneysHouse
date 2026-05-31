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
import { apps } from "@/lib/data/apps";
import { normalizeEmail } from "@/lib/admin-utils";
import {
  REFERRAL_CODES_UPDATED_EVENT,
  getReferralBonusFromData,
  hasReferralProgram,
  mergeReferralsWithAppDefaults,
  parseStoredEntry,
  type AppReferrals,
  type ReferralBonus,
} from "@/lib/referrals-shared";

const REFERRAL_STORAGE_KEY = "moneys-house-referrals";
const LEGACY_REFERRAL_CODES_KEY = "moneys-house-referral-codes";

interface ReferralContextType {
  ready: boolean;
  referrals: Record<string, AppReferrals>;
  refreshReferrals: () => Promise<void>;
  getReferralData: (appId: string) => AppReferrals;
  getReferralBonus: (appId: string) => ReferralBonus | null;
  hasReferralContent: (appId: string) => boolean;
  addReferralCode: (
    appId: string,
    code: string,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
  removeReferralCode: (
    appId: string,
    code: string,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
  addReferralLink: (
    appId: string,
    link: string,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
  removeReferralLink: (
    appId: string,
    link: string,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
  setReferralBonus: (
    appId: string,
    bonus: { title: string; description: string },
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

function readLegacyLocalStorage(): Record<string, AppReferrals> {
  if (typeof window === "undefined") return {};

  const readKey = (key: string): Record<string, AppReferrals> => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const result: Record<string, AppReferrals> = {};
      for (const [appId, value] of Object.entries(parsed)) {
        result[appId] = parseStoredEntry(value);
      }
      return result;
    } catch {
      return {};
    }
  };

  const current = readKey(REFERRAL_STORAGE_KEY);
  if (Object.keys(current).length > 0) return current;
  return readKey(LEGACY_REFERRAL_CODES_KEY);
}

function notifyReferralsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REFERRAL_CODES_UPDATED_EVENT));
}

async function postReferralAction(
  payload: Record<string, unknown>
): Promise<{ ok: boolean; error?: string; referrals?: Record<string, AppReferrals> }> {
  const res = await fetch("/api/referrals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as {
    ok: boolean;
    error?: string;
    referrals?: Record<string, AppReferrals>;
  };
  return data;
}

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referrals, setReferrals] = useState<Record<string, AppReferrals>>({});
  const [ready, setReady] = useState(false);
  const [migrated, setMigrated] = useState(false);

  const refreshReferrals = useCallback(async () => {
    try {
      const res = await fetch("/api/referrals", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { referrals?: Record<string, AppReferrals> };
        if (data.referrals) {
          setReferrals(data.referrals);
          notifyReferralsChanged();
        }
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshReferrals();
  }, [refreshReferrals]);

  useEffect(() => {
    if (migrated || !ready) return;

    const legacy = readLegacyLocalStorage();
    if (Object.keys(legacy).length === 0) {
      setMigrated(true);
      return;
    }

    const storedUser = localStorage.getItem("moneyhub-user");
    if (!storedUser) {
      setMigrated(true);
      return;
    }

    (async () => {
      try {
        const parsed = JSON.parse(storedUser) as { user?: { email?: string } };
        const email = parsed.user?.email;
        if (!email) {
          setMigrated(true);
          return;
        }

        const adminRes = await fetch("/api/admins", { cache: "no-store" });
        if (!adminRes.ok) {
          setMigrated(true);
          return;
        }
        const adminData = (await adminRes.json()) as { emails?: string[] };
        const isAdmin = Array.isArray(adminData.emails)
          ? adminData.emails.map(normalizeEmail).includes(normalizeEmail(email))
          : false;
        if (!isAdmin) {
          setMigrated(true);
          return;
        }

        const result = await postReferralAction({
          action: "import",
          data: legacy,
          requestedBy: normalizeEmail(email),
        });
        if (result.ok) {
          localStorage.removeItem(REFERRAL_STORAGE_KEY);
          localStorage.removeItem(LEGACY_REFERRAL_CODES_KEY);
          if (result.referrals) setReferrals(result.referrals);
          notifyReferralsChanged();
        }
      } catch {
        // ignore migration errors
      } finally {
        setMigrated(true);
      }
    })();
  }, [migrated, ready]);

  const getReferralData = useCallback(
    (appId: string) => referrals[appId] ?? mergeReferralsWithAppDefaults(appId, {}),
    [referrals]
  );

  const getReferralBonus = useCallback(
    (appId: string) => getReferralBonusFromData(appId, getReferralData(appId)),
    [getReferralData]
  );

  const hasReferralContent = useCallback(
    (appId: string) => {
      const data = getReferralData(appId);
      return data.codes.length > 0 || data.links.length > 0;
    },
    [getReferralData]
  );

  const applyMutation = useCallback(
    async (payload: Record<string, unknown>) => {
      const result = await postReferralAction(payload);
      if (result.ok && result.referrals) {
        setReferrals(result.referrals);
        notifyReferralsChanged();
      }
      return { ok: result.ok, error: result.error };
    },
    []
  );

  const addReferralCode = useCallback(
    (appId: string, code: string, requestedBy: string) =>
      applyMutation({
        action: "addCode",
        appId,
        value: code,
        requestedBy: normalizeEmail(requestedBy),
      }),
    [applyMutation]
  );

  const removeReferralCode = useCallback(
    (appId: string, code: string, requestedBy: string) =>
      applyMutation({
        action: "removeCode",
        appId,
        value: code,
        requestedBy: normalizeEmail(requestedBy),
      }),
    [applyMutation]
  );

  const addReferralLink = useCallback(
    (appId: string, link: string, requestedBy: string) =>
      applyMutation({
        action: "addLink",
        appId,
        value: link,
        requestedBy: normalizeEmail(requestedBy),
      }),
    [applyMutation]
  );

  const removeReferralLink = useCallback(
    (appId: string, link: string, requestedBy: string) =>
      applyMutation({
        action: "removeLink",
        appId,
        value: link,
        requestedBy: normalizeEmail(requestedBy),
      }),
    [applyMutation]
  );

  const setReferralBonus = useCallback(
    (appId: string, bonus: { title: string; description: string }, requestedBy: string) =>
      applyMutation({
        action: "setBonus",
        appId,
        bonusTitle: bonus.title,
        bonusDescription: bonus.description,
        requestedBy: normalizeEmail(requestedBy),
      }),
    [applyMutation]
  );

  const value = useMemo(
    () => ({
      ready,
      referrals,
      refreshReferrals,
      getReferralData,
      getReferralBonus,
      hasReferralContent,
      addReferralCode,
      removeReferralCode,
      addReferralLink,
      removeReferralLink,
      setReferralBonus,
    }),
    [
      ready,
      referrals,
      refreshReferrals,
      getReferralData,
      getReferralBonus,
      hasReferralContent,
      addReferralCode,
      removeReferralCode,
      addReferralLink,
      removeReferralLink,
      setReferralBonus,
    ]
  );

  return <ReferralContext.Provider value={value}>{children}</ReferralContext.Provider>;
}

export function useReferrals() {
  const ctx = useContext(ReferralContext);
  if (!ctx) throw new Error("useReferrals must be used within ReferralProvider");
  return ctx;
}

export { hasReferralProgram, REFERRAL_CODES_UPDATED_EVENT };
export type { AppReferrals, ReferralBonus };

/** Toutes les apps avec parrainage — pratique pour l'admin et la FAQ */
export function getReferralAppIds(): string[] {
  return apps.filter((a) => a.hasReferral !== false).map((a) => a.id);
}
