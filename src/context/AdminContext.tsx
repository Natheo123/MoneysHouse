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
import {
  ADMIN_ROLE_LABELS,
  canChangeAdminRoles,
  canManageAdmins,
  type AdminMember,
  type AdminRole,
} from "@/lib/admin-shared";
import { normalizeEmail, OWNER_EMAIL, isOwnerEmail } from "@/lib/admin-utils";

interface AdminContextType {
  adminEmails: string[];
  adminMembers: AdminMember[];
  ready: boolean;
  isAdmin: (email: string) => boolean;
  isOwner: (email: string) => boolean;
  getRole: (email: string) => AdminRole | "owner" | null;
  canManageAdmins: (email: string) => boolean;
  canChangeRoles: (email: string) => boolean;
  refreshAdmins: () => Promise<void>;
  addAdmin: (
    email: string,
    requestedBy: string,
    role?: AdminRole
  ) => Promise<{ ok: boolean; error?: string }>;
  removeAdmin: (email: string, requestedBy: string) => Promise<{ ok: boolean; error?: string }>;
  setAdminRole: (
    email: string,
    role: AdminRole,
    requestedBy: string
  ) => Promise<{ ok: boolean; error?: string }>;
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
        body: JSON.stringify({ action: "add", email, role: "member", requestedBy }),
      });
    }
    localStorage.removeItem(LEGACY_ADMINS_KEY);
  } catch {
    // ignore migration errors
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminEmails, setAdminEmails] = useState<string[]>([normalizeEmail(OWNER_EMAIL)]);
  const [adminMembers, setAdminMembers] = useState<AdminMember[]>([]);
  const [ready, setReady] = useState(false);
  const [migrated, setMigrated] = useState(false);

  const refreshAdmins = useCallback(async () => {
    try {
      const res = await fetch("/api/admins", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { emails?: string[]; admins?: AdminMember[] };
        if (Array.isArray(data.emails) && data.emails.length > 0) {
          setAdminEmails(data.emails.map(normalizeEmail));
        }
        if (Array.isArray(data.admins)) {
          setAdminMembers(data.admins);
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

  const getRole = useCallback(
    (email: string): AdminRole | "owner" | null => {
      const normalized = normalizeEmail(email);
      if (isOwnerEmail(normalized)) return "owner";
      const member = adminMembers.find((m) => m.email === normalized);
      if (member) return member.role;
      if (adminEmails.includes(normalized)) return "member";
      return null;
    },
    [adminMembers, adminEmails]
  );

  const canManageAdminsFor = useCallback(
    (email: string) => {
      const role = getRole(email);
      return role !== null && canManageAdmins(role);
    },
    [getRole]
  );

  const canChangeRolesFor = useCallback(
    (email: string) => {
      const role = getRole(email);
      return role !== null && canChangeAdminRoles(role);
    },
    [getRole]
  );

  const addAdmin = useCallback(
    async (email: string, requestedBy: string, role: AdminRole = "member") => {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          email,
          role,
          requestedBy: normalizeEmail(requestedBy),
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        emails?: string[];
        admins?: AdminMember[];
      };
      if (data.ok) {
        if (data.emails) setAdminEmails(data.emails.map(normalizeEmail));
        if (data.admins) setAdminMembers(data.admins);
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
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        emails?: string[];
        admins?: AdminMember[];
      };
      if (data.ok) {
        if (data.emails) setAdminEmails(data.emails.map(normalizeEmail));
        if (data.admins) setAdminMembers(data.admins);
      }
      return { ok: data.ok, error: data.error };
    },
    []
  );

  const setAdminRole = useCallback(
    async (email: string, role: AdminRole, requestedBy: string) => {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setRole",
          email,
          role,
          requestedBy: normalizeEmail(requestedBy),
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        emails?: string[];
        admins?: AdminMember[];
      };
      if (data.ok) {
        if (data.emails) setAdminEmails(data.emails.map(normalizeEmail));
        if (data.admins) setAdminMembers(data.admins);
      }
      return { ok: data.ok, error: data.error };
    },
    []
  );

  const value = useMemo(
    () => ({
      adminEmails,
      adminMembers,
      ready,
      isAdmin,
      isOwner,
      getRole,
      canManageAdmins: canManageAdminsFor,
      canChangeRoles: canChangeRolesFor,
      refreshAdmins,
      addAdmin,
      removeAdmin,
      setAdminRole,
    }),
    [
      adminEmails,
      adminMembers,
      ready,
      isAdmin,
      isOwner,
      getRole,
      canManageAdminsFor,
      canChangeRolesFor,
      refreshAdmins,
      addAdmin,
      removeAdmin,
      setAdminRole,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export { OWNER_EMAIL, ADMIN_ROLE_LABELS };
