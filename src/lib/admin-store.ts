import { promises as fs } from "fs";
import path from "path";
import { isOwnerEmail, normalizeEmail, OWNER_EMAIL } from "@/lib/admin-utils";
import {
  canChangeAdminRoles,
  canManageAdmins,
  canRemoveAdmin,
  isAdminRole,
  parseStoredAdmins,
  serializeStoredAdmins,
  type AdminMember,
  type AdminRole,
} from "@/lib/admin-shared";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readStoredAdminsFromGitHub,
  writeStoredAdminsToGitHub,
  type StoredAdmins,
} from "@/lib/admin-github";

const ADMINS_PATH = path.join(process.cwd(), "data", "admins.json");

function envAdmins(): AdminMember[] {
  const raw = process.env.EXTRA_ADMIN_EMAILS;
  if (!raw) return [];
  return raw
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean)
    .map((email) => ({ email, role: "member" as const }));
}

async function readFileAdmins(): Promise<AdminMember[]> {
  try {
    const content = await fs.readFile(ADMINS_PATH, "utf-8");
    return parseStoredAdmins(JSON.parse(content) as unknown);
  } catch {
    return [];
  }
}

async function writeFileAdmins(admins: AdminMember[]): Promise<void> {
  await fs.mkdir(path.dirname(ADMINS_PATH), { recursive: true });
  await fs.writeFile(
    ADMINS_PATH,
    `${JSON.stringify(serializeStoredAdmins(admins), null, 2)}\n`,
    "utf-8"
  );
}

async function readStoredAdmins(): Promise<StoredAdmins> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredAdminsFromGitHub();
      if (github) return github;
    } catch {
      // fallback fichier embarqué si GitHub indisponible
    }
  }

  return {
    admins: await readFileAdmins(),
    source: "file",
  };
}

async function writeStoredAdmins(stored: StoredAdmins, admins: AdminMember[]): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredAdminsToGitHub(admins, stored.sha);
    return;
  }
  await writeFileAdmins(admins);
}

function mergeWithEnvAdmins(stored: AdminMember[]): AdminMember[] {
  const map = new Map<string, AdminMember>();
  for (const admin of stored) {
    map.set(admin.email, admin);
  }
  for (const admin of envAdmins()) {
    if (!map.has(admin.email)) {
      map.set(admin.email, admin);
    }
  }
  return [...map.values()];
}

export async function getAdminMembers(): Promise<AdminMember[]> {
  const stored = await readStoredAdmins();
  return mergeWithEnvAdmins(stored.admins);
}

export async function getAllAdminEmails(): Promise<string[]> {
  const owner = normalizeEmail(OWNER_EMAIL);
  const members = await getAdminMembers();
  return [owner, ...members.map((m) => m.email)];
}

export async function getAdminRole(
  email: string
): Promise<AdminRole | "owner" | null> {
  const normalized = normalizeEmail(email);
  if (isOwnerEmail(normalized)) return "owner";
  const member = (await getAdminMembers()).find((m) => m.email === normalized);
  return member?.role ?? null;
}

export async function canManageAdminsByEmail(email: string): Promise<boolean> {
  const role = await getAdminRole(email);
  return role !== null && canManageAdmins(role);
}

export async function addExtraAdmin(
  email: string,
  role: AdminRole = "member"
): Promise<{ ok: boolean; error?: string }> {
  const newEmail = normalizeEmail(email);
  if (!newEmail.includes("@")) {
    return { ok: false, error: "Adresse email invalide." };
  }
  if (isOwnerEmail(newEmail)) {
    return { ok: false, error: "Le propriétaire est déjà administrateur." };
  }
  if (!isAdminRole(role)) {
    return { ok: false, error: "Rôle invalide." };
  }

  const stored = await readStoredAdmins();
  const all = await getAllAdminEmails();
  if (all.includes(newEmail)) {
    return { ok: false, error: "Cet email est déjà administrateur." };
  }

  try {
    await writeStoredAdmins(stored, [...stored.admins, { email: newEmail, role }]);
    return { ok: true };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return {
      ok: false,
      error: hint ? `${detail} ${hint}` : detail,
    };
  }
}

export async function removeExtraAdmin(email: string): Promise<{ ok: boolean; error?: string }> {
  const target = normalizeEmail(email);
  if (isOwnerEmail(target)) {
    return { ok: false, error: "Le propriétaire ne peut pas être retiré." };
  }

  const stored = await readStoredAdmins();
  if (!stored.admins.some((m) => m.email === target) && !envAdmins().some((m) => m.email === target)) {
    return { ok: false, error: "Cet administrateur n'est pas dans la liste." };
  }
  if (!stored.admins.some((m) => m.email === target) && envAdmins().some((m) => m.email === target)) {
    return {
      ok: false,
      error: "Cet admin est défini via EXTRA_ADMIN_EMAILS et ne peut pas être retiré depuis l'interface.",
    };
  }

  try {
    await writeStoredAdmins(
      stored,
      stored.admins.filter((m) => m.email !== target)
    );
    return { ok: true };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return {
      ok: false,
      error: hint ? `${detail} ${hint}` : detail,
    };
  }
}

export async function setExtraAdminRole(
  email: string,
  role: AdminRole
): Promise<{ ok: boolean; error?: string }> {
  const target = normalizeEmail(email);
  if (isOwnerEmail(target)) {
    return { ok: false, error: "Le rôle du propriétaire ne peut pas être modifié." };
  }
  if (!isAdminRole(role)) {
    return { ok: false, error: "Rôle invalide." };
  }

  const stored = await readStoredAdmins();
  const index = stored.admins.findIndex((m) => m.email === target);
  if (index === -1) {
    return { ok: false, error: "Cet administrateur n'est pas dans la liste." };
  }

  try {
    const next = [...stored.admins];
    next[index] = { email: target, role };
    await writeStoredAdmins(stored, next);
    return { ok: true };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return {
      ok: false,
      error: hint ? `${detail} ${hint}` : detail,
    };
  }
}

export async function assertCanManageAdmins(
  requestedBy: string
): Promise<{ ok: true; role: AdminRole | "owner" } | { ok: false; error: string }> {
  const role = await getAdminRole(requestedBy);
  if (!role || !canManageAdmins(role)) {
    return { ok: false, error: "Vous n'avez pas la permission de gérer les administrateurs." };
  }
  return { ok: true, role };
}

export async function assertCanRemoveAdmin(
  requestedBy: string,
  targetEmail: string
): Promise<{ ok: false; error: string } | { ok: true }> {
  const actorRole = await getAdminRole(requestedBy);
  if (!actorRole || !canManageAdmins(actorRole)) {
    return { ok: false, error: "Vous n'avez pas la permission de retirer des administrateurs." };
  }

  const targetRole = await getAdminRole(targetEmail);
  if (!targetRole || targetRole === "owner") {
    return { ok: false, error: "Cet administrateur ne peut pas être retiré." };
  }

  if (!canRemoveAdmin(actorRole, targetRole)) {
    return {
      ok: false,
      error: "Seul le propriétaire peut retirer un gestionnaire.",
    };
  }

  return { ok: true };
}

export async function assertCanChangeRoles(
  requestedBy: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const role = await getAdminRole(requestedBy);
  if (!role || !canChangeAdminRoles(role)) {
    return { ok: false, error: "Seul le propriétaire peut modifier les rôles." };
  }
  return { ok: true };
}
