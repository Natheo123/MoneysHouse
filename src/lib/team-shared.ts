export type TeamRole = "founder" | "admin" | "moderator" | "member";

export interface TeamMemberStored {
  discordId: string;
  role: TeamRole;
  order: number;
}

export interface DiscordProfile {
  id: string;
  username: string;
  globalName: string | null;
  avatarUrl: string;
  bannerUrl: string | null;
  accentColor: number | null;
  profileUrl: string;
}

export interface TeamMemberPublic extends TeamMemberStored {
  profile: DiscordProfile | null;
}

export const DEFAULT_FOUNDER_IDS = [
  "317358740124991488",
  "703802589611032597",
  "1401999412019859509",
] as const;

export const TEAM_ROLE_ORDER: Record<TeamRole, number> = {
  founder: 0,
  admin: 1,
  moderator: 2,
  member: 3,
};

export function isValidDiscordId(id: string): boolean {
  return /^\d{17,20}$/.test(id.trim());
}

export function parseStoredTeam(raw: unknown): TeamMemberStored[] {
  if (!Array.isArray(raw)) return [];
  const members: TeamMemberStored[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const entry = item as { discordId?: unknown; role?: unknown; order?: unknown };
    const discordId = typeof entry.discordId === "string" ? entry.discordId.trim() : "";
    if (!isValidDiscordId(discordId)) continue;
    const role =
      entry.role === "founder" ||
      entry.role === "admin" ||
      entry.role === "moderator" ||
      entry.role === "member"
        ? entry.role
        : "member";
    const order = typeof entry.order === "number" ? entry.order : members.length;
    if (members.some((m) => m.discordId === discordId)) continue;
    members.push({ discordId, role, order });
  }
  return members.sort((a, b) => a.order - b.order || TEAM_ROLE_ORDER[a.role] - TEAM_ROLE_ORDER[b.role]);
}

export function defaultTeamMembers(): TeamMemberStored[] {
  return DEFAULT_FOUNDER_IDS.map((discordId, index) => ({
    discordId,
    role: "founder" as const,
    order: index,
  }));
}
