"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { normalizeEmail, OWNER_EMAIL, isOwnerEmail } from "@/lib/admin-utils";

interface AdminContextType {
  adminEmails: string[];
  ready: boolean;
  isAdmin: (email: string) => boolean;
  isOwner: (email: string) => boolean;
  refreshAdmins: () => Promise<void>;
  addAdmin: (email: string, requestedBy: string) => Promise<{ ok: boolean; error?: string }>;
  removeAdmin: (email: string, requestedBy: string) => Promise<{ ok: boolean; error?: string }>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const LEGACY_ADMINS_KEY = "moneys-house-admins";

async function migrateLegacyAdmins(requestedBy: string): Promise<void> {
  if (typeof window === "undefined") return;
  const legacyRaw = localStorage.getItem(LEGACY_ADMINS_KEY);
  if (!legacyRaw) return;

  try {
    const legacy = JSON.parse(legacyRaw) as string[];
    if (!Array.isArray(legacy)) return;

    for (const email of legacy) {
      await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", email, requestedBy }),
      });
    }
    localStorage.removeItem(LEGACY_ADMINS_KEY);
  } catch {
    // ignore migration errors
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminEmails, setAdminEmails] = useState<string[]>([normalizeEmail(OWNER_EMAIL)]);
  const [ready, setReady] = useState(false);
  const [migrated, setMigrated] = useState(false);

  const refreshAdmins = useCallback(async () => {
    try {
      const res = await fetch("/api/admins", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { emails?: string[] };
        if (Array.isArray(data.emails) && data.emails.length > 0) {
          setAdminEmails(data.emails.map(normalizeEmail));
        }
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshAdmins();
  }, [refreshAdmins]);

  useEffect(() => {
    if (migrated || !ready) return;
    const storedUser = localStorage.getItem("moneyhub-user");
    if (!storedUser) return;

    try {
      const data = JSON.parse(storedUser) as { user?: { email?: string } };
      const email = data.user?.email;
      if (email && isOwnerEmail(email)) {
        migrateLegacyAdmins(normalizeEmail(email)).then(() => {
          setMigrated(true);
          refreshAdmins();
        });
      } else {
        setMigrated(true);
      }
    } catch {
      setMigrated(true);
    }
  }, [migrated, ready, refreshAdmins]);

  const isAdmin = useCallback(
    (email: string) => adminEmails.includes(normalizeEmail(email)),
    [adminEmails]
  );

  const isOwner = useCallback((email: string) => isOwnerEmail(email), []);

  const addAdmin = useCallback(
    async (email: string, requestedBy: string) => {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          email,
          requestedBy: normalizeEmail(requestedBy),
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; emails?: string[] };
      if (data.ok && data.emails) {
        setAdminEmails(data.emails.map(normalizeEmail));
      }
      return { ok: data.ok, error: data.error };
    },
    []
  );

  const removeAdmin = useCallback(
    async (email: string, requestedBy: string) => {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove",
          email,
          requestedBy: normalizeEmail(requestedBy),
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; emails?: string[] };
      if (data.ok && data.emails) {
        setAdminEmails(data.emails.map(normalizeEmail));
      }
      return { ok: data.ok, error: data.error };
    },
    []
  );

  return (
    <AdminContext.Provider
      value={{
        adminEmails,
        ready,
        isAdmin,
        isOwner,
        refreshAdmins,
        addAdmin,
        removeAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export { OWNER_EMAIL } from "@/lib/admin-utils";
