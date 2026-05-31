import { siteConfig } from "@/lib/config";

const ADMINS_STORAGE_KEY = "moneys-house-admins";

export const OWNER_EMAIL = siteConfig.ownerEmail;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function loadExtraAdmins(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADMINS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExtraAdmins(admins: string[]): void {
  localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
}

export function getAllAdminEmails(): string[] {
  const owner = normalizeEmail(OWNER_EMAIL);
  const extras = loadExtraAdmins().map(normalizeEmail).filter((e) => e !== owner);
  return [owner, ...extras];
}

export function isOwner(email: string): boolean {
  return normalizeEmail(email) === normalizeEmail(OWNER_EMAIL);
}

export function isAdmin(email: string): boolean {
  const normalized = normalizeEmail(email);
  return getAllAdminEmails().includes(normalized);
}

export function addAdmin(email: string, requestedBy: string): { ok: boolean; error?: string } {
  if (!isOwner(requestedBy)) {
    return { ok: false, error: "Seul le propriétaire peut ajouter des administrateurs." };
  }
  const newEmail = normalizeEmail(email);
  if (!newEmail.includes("@")) {
    return { ok: false, error: "Adresse email invalide." };
  }
  if (isAdmin(newEmail)) {
    return { ok: false, error: "Cet email est déjà administrateur." };
  }
  const extras = loadExtraAdmins().map(normalizeEmail);
  saveExtraAdmins([...extras, newEmail]);
  return { ok: true };
}

export function removeAdmin(email: string, requestedBy: string): { ok: boolean; error?: string } {
  if (!isOwner(requestedBy)) {
    return { ok: false, error: "Seul le propriétaire peut retirer des administrateurs." };
  }
  const target = normalizeEmail(email);
  if (isOwner(target)) {
    return { ok: false, error: "Le propriétaire ne peut pas être retiré." };
  }
  const extras = loadExtraAdmins().map(normalizeEmail).filter((e) => e !== target);
  saveExtraAdmins(extras);
  return { ok: true };
}
