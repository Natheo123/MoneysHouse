import { promises as fs } from "fs";
import path from "path";
import { isOwnerEmail, normalizeEmail, OWNER_EMAIL } from "@/lib/admin-utils";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readStoredAdminsFromGitHub,
  writeStoredAdminsToGitHub,
  type StoredAdmins,
} from "@/lib/admin-github";

const ADMINS_PATH = path.join(process.cwd(), "data", "admins.json");

function envAdmins(): string[] {
  const raw = process.env.EXTRA_ADMIN_EMAILS;
  if (!raw) return [];
  return raw.split(",").map(normalizeEmail).filter(Boolean);
}

async function readFileAdmins(): Promise<string[]> {
  try {
    const content = await fs.readFile(ADMINS_PATH, "utf-8");
    const parsed = JSON.parse(content) as { emails?: unknown };
    if (!Array.isArray(parsed.emails)) return [];
    return parsed.emails
      .filter((e): e is string => typeof e === "string")
      .map(normalizeEmail)
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function writeFileAdmins(emails: string[]): Promise<void> {
  const owner = normalizeEmail(OWNER_EMAIL);
  const unique = [...new Set(emails.map(normalizeEmail).filter((e) => e && e !== owner))];
  await fs.mkdir(path.dirname(ADMINS_PATH), { recursive: true });
  await fs.writeFile(ADMINS_PATH, `${JSON.stringify({ emails: unique }, null, 2)}\n`, "utf-8");
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
    emails: await readFileAdmins(),
    source: "file",
  };
}

async function writeStoredAdmins(stored: StoredAdmins, emails: string[]): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredAdminsToGitHub(emails, stored.sha);
    return;
  }
  await writeFileAdmins(emails);
}

export async function getExtraAdmins(): Promise<string[]> {
  const stored = await readStoredAdmins();
  return [...new Set([...stored.emails, ...envAdmins()])].filter(
    (e) => e !== normalizeEmail(OWNER_EMAIL)
  );
}

export async function getAllAdminEmails(): Promise<string[]> {
  const owner = normalizeEmail(OWNER_EMAIL);
  const extras = await getExtraAdmins();
  return [owner, ...extras];
}

export async function addExtraAdmin(email: string): Promise<{ ok: boolean; error?: string }> {
  const newEmail = normalizeEmail(email);
  if (!newEmail.includes("@")) {
    return { ok: false, error: "Adresse email invalide." };
  }
  if (isOwnerEmail(newEmail)) {
    return { ok: false, error: "Le propriétaire est déjà administrateur." };
  }

  const stored = await readStoredAdmins();
  const all = await getAllAdminEmails();
  if (all.includes(newEmail)) {
    return { ok: false, error: "Cet email est déjà administrateur." };
  }

  try {
    await writeStoredAdmins(stored, [...stored.emails, newEmail]);
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
  if (!stored.emails.includes(target) && !envAdmins().includes(target)) {
    return { ok: false, error: "Cet administrateur n'est pas dans la liste." };
  }
  if (!stored.emails.includes(target) && envAdmins().includes(target)) {
    return {
      ok: false,
      error: "Cet admin est défini via EXTRA_ADMIN_EMAILS et ne peut pas être retiré depuis l'interface.",
    };
  }

  try {
    await writeStoredAdmins(
      stored,
      stored.emails.filter((e) => e !== target)
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
