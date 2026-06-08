import "server-only";

import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { normalizeEmail } from "@/lib/admin-utils";
import {
  emptyMembersNotifications,
  parseMembersNotifications,
  serializeMembersNotifications,
  type MembersNotificationsPayload,
  type SiteMember,
  type SiteNotification,
} from "@/lib/members-notifications-shared";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readMembersNotificationsFromGitHub,
  writeMembersNotificationsToGitHub,
  type StoredMembersNotifications,
} from "@/lib/members-notifications-github";

const DATA_PATH = path.join(process.cwd(), "data", "members-notifications.json");

const WELCOME_MESSAGE = "Bienvenue sur Money's House ! Découvrez nos applications.";

async function readFileData(): Promise<MembersNotificationsPayload> {
  try {
    const content = await fs.readFile(DATA_PATH, "utf-8");
    return parseMembersNotifications(JSON.parse(content) as unknown);
  } catch {
    return emptyMembersNotifications();
  }
}

async function writeFileData(data: MembersNotificationsPayload): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, `${JSON.stringify(serializeMembersNotifications(data), null, 2)}\n`, "utf-8");
}

async function readStored(): Promise<StoredMembersNotifications> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readMembersNotificationsFromGitHub();
      if (github) return github;
    } catch {
      // fallback fichier local
    }
  }

  return {
    data: await readFileData(),
    source: "file",
  };
}

async function writeStored(
  stored: StoredMembersNotifications,
  data: MembersNotificationsPayload
): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeMembersNotificationsToGitHub(data, stored.sha);
    return;
  }
  await writeFileData(data);
}

async function mutate(
  mutator: (current: MembersNotificationsPayload) => MembersNotificationsPayload | { ok: false; error: string }
): Promise<{ ok: true; data: MembersNotificationsPayload } | { ok: false; error: string }> {
  const stored = await readStored();
  const result = mutator(stored.data);
  if ("ok" in result && result.ok === false) return result;

  const next = serializeMembersNotifications(result as MembersNotificationsPayload);
  try {
    await writeStored(stored, next);
    return { ok: true, data: next };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}

function pushNotification(
  inbox: Record<string, SiteNotification[]>,
  email: string,
  message: string
): void {
  const normalized = normalizeEmail(email);
  const list = inbox[normalized] ?? [];
  list.unshift({
    id: randomUUID(),
    message: message.trim(),
    read: false,
    createdAt: new Date().toISOString(),
  });
  inbox[normalized] = list.slice(0, 100);
}

export async function getSiteMembersServer(): Promise<SiteMember[]> {
  const stored = await readStored();
  return stored.data.members;
}

export async function getMemberProfileServer(email: string): Promise<SiteMember | null> {
  const normalized = normalizeEmail(email);
  const stored = await readStored();
  return stored.data.members.find((m) => m.email === normalized) ?? null;
}

export async function getNotificationsForUserServer(email: string): Promise<SiteNotification[]> {
  const normalized = normalizeEmail(email);
  const stored = await readStored();
  return stored.data.inbox[normalized] ?? [];
}

export async function registerSiteMemberServer(
  email: string,
  name: string
): Promise<{ ok: boolean; error?: string }> {
  const normalized = normalizeEmail(email);
  const trimmedName = name.trim();
  if (!normalized.includes("@") || !trimmedName) {
    return { ok: false, error: "Données invalides." };
  }

  const result = await mutate((current) => {
    const next = serializeMembersNotifications(current);
    const existing = next.members.find((m) => m.email === normalized);
    if (existing) {
      if (existing.name !== trimmedName) existing.name = trimmedName;
      return next;
    }

    next.members.push({
      email: normalized,
      name: trimmedName,
      registeredAt: new Date().toISOString(),
    });
    next.members.sort((a, b) => a.email.localeCompare(b.email));

    pushNotification(next.inbox, normalized, WELCOME_MESSAGE);
    return next;
  });

  if (!result.ok) return result;
  return { ok: true };
}

export async function markNotificationReadServer(
  email: string,
  notificationId: string
): Promise<{ ok: boolean; error?: string }> {
  const normalized = normalizeEmail(email);
  const id = notificationId.trim();
  if (!normalized.includes("@") || !id) {
    return { ok: false, error: "Données invalides." };
  }

  const result = await mutate((current) => {
    const next = serializeMembersNotifications(current);
    const list = next.inbox[normalized];
    if (!list) return { ok: false, error: "Notification introuvable." };

    const index = list.findIndex((n) => n.id === id);
    if (index === -1) return { ok: false, error: "Notification introuvable." };

    list[index] = { ...list[index], read: true };
    next.inbox[normalized] = list;
    return next;
  });

  return result.ok ? { ok: true } : result;
}

export async function sendAdminNotificationServer(payload: {
  target: "all" | string;
  message: string;
}): Promise<{ ok: boolean; error?: string; sentCount?: number }> {
  const message = payload.message.trim();
  if (!message) return { ok: false, error: "Le message est obligatoire." };

  const result = await mutate((current) => {
    const next = serializeMembersNotifications(current);

    if (payload.target === "all") {
      if (next.members.length === 0) {
        return { ok: false, error: "Aucun membre inscrit pour le moment." };
      }
      for (const member of next.members) {
        pushNotification(next.inbox, member.email, message);
      }
      return next;
    }

    const email = normalizeEmail(payload.target);
    if (!email.includes("@")) {
      return { ok: false, error: "Adresse email invalide." };
    }

    const member = next.members.find((m) => m.email === email);
    if (!member) {
      return {
        ok: false,
        error: "Aucun compte trouvé avec cet email. La personne doit d'abord s'inscrire sur le site.",
      };
    }

    pushNotification(next.inbox, email, message);
    return next;
  });

  if (!result.ok) return result;

  if (payload.target === "all") {
    return { ok: true, sentCount: result.data.members.length };
  }
  return { ok: true, sentCount: 1 };
}
