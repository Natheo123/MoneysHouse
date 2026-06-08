export interface SiteMember {
  email: string;
  name: string;
  registeredAt: string;
}

export interface SiteNotification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface MembersNotificationsPayload {
  members: SiteMember[];
  inbox: Record<string, SiteNotification[]>;
}

export function emptyMembersNotifications(): MembersNotificationsPayload {
  return { members: [], inbox: {} };
}

export function parseMembersNotifications(raw: unknown): MembersNotificationsPayload {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return emptyMembersNotifications();
  }

  const data = raw as Record<string, unknown>;
  const members: SiteMember[] = [];
  if (Array.isArray(data.members)) {
    for (const item of data.members) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const email = typeof row.email === "string" ? row.email.trim().toLowerCase() : "";
      const name = typeof row.name === "string" ? row.name.trim() : "";
      const registeredAt = typeof row.registeredAt === "string" ? row.registeredAt : "";
      if (!email.includes("@") || !name) continue;
      members.push({ email, name, registeredAt: registeredAt || new Date().toISOString() });
    }
  }

  const inbox: Record<string, SiteNotification[]> = {};
  if (data.inbox && typeof data.inbox === "object" && !Array.isArray(data.inbox)) {
    for (const [email, items] of Object.entries(data.inbox as Record<string, unknown>)) {
      const normalized = email.trim().toLowerCase();
      if (!normalized.includes("@") || !Array.isArray(items)) continue;
      const parsed: SiteNotification[] = [];
      for (const item of items) {
        if (!item || typeof item !== "object") continue;
        const row = item as Record<string, unknown>;
        const id = typeof row.id === "string" ? row.id.trim() : "";
        const message = typeof row.message === "string" ? row.message.trim() : "";
        const createdAt = typeof row.createdAt === "string" ? row.createdAt : "";
        if (!id || !message) continue;
        parsed.push({
          id,
          message,
          read: row.read === true,
          createdAt: createdAt || new Date().toISOString(),
        });
      }
      if (parsed.length > 0) inbox[normalized] = parsed;
    }
  }

  return { members, inbox };
}

export function serializeMembersNotifications(payload: MembersNotificationsPayload): MembersNotificationsPayload {
  const members = [...payload.members]
    .map((m) => ({
      email: m.email.trim().toLowerCase(),
      name: m.name.trim(),
      registeredAt: m.registeredAt,
    }))
    .sort((a, b) => a.email.localeCompare(b.email));

  const inbox: Record<string, SiteNotification[]> = {};
  for (const [email, items] of Object.entries(payload.inbox)) {
    const normalized = email.trim().toLowerCase();
    inbox[normalized] = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return { members, inbox };
}
