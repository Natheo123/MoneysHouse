import { normalizeEmail } from "@/lib/admin-utils";

export type AdminRole = "member" | "manager";

export interface AdminMember {
  email: string;
  role: AdminRole;
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  member: "Éditeur",
  manager: "Gestionnaire",
};

export function isAdminRole(value: unknown): value is AdminRole {
  return value === "member" || value === "manager";
}

export function parseAdminMember(value: unknown): AdminMember | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (typeof row.email !== "string" || !isAdminRole(row.role)) return null;
  const email = normalizeEmail(row.email);
  if (!email.includes("@")) return null;
  return { email, role: row.role };
}

/** Parse admins.json — supporte l'ancien format { emails: [] }. */
export function parseStoredAdmins(raw: unknown): AdminMember[] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];

  const data = raw as Record<string, unknown>;

  if (Array.isArray(data.admins)) {
    return data.admins
      .map(parseAdminMember)
      .filter((admin): admin is AdminMember => admin !== null);
  }

  if (Array.isArray(data.emails)) {
    return data.emails
      .filter((e): e is string => typeof e === "string")
      .map((email) => ({ email: normalizeEmail(email), role: "member" as const }))
      .filter((admin) => admin.email.includes("@"));
  }

  return [];
}

export function serializeStoredAdmins(admins: AdminMember[]): { admins: AdminMember[] } {
  const unique = new Map<string, AdminMember>();
  for (const admin of admins) {
    const email = normalizeEmail(admin.email);
    if (!email.includes("@")) continue;
    unique.set(email, { email, role: admin.role });
  }
  return { admins: [...unique.values()] };
}

export function canManageAdmins(role: AdminRole | "owner"): boolean {
  return role === "owner" || role === "manager";
}

export function canChangeAdminRoles(role: AdminRole | "owner"): boolean {
  return role === "owner";
}

export function canRemoveAdmin(
  actorRole: AdminRole | "owner",
  targetRole: AdminRole | "owner"
): boolean {
  if (targetRole === "owner") return false;
  if (actorRole === "owner") return true;
  if (actorRole === "manager") return targetRole === "member";
  return false;
}
