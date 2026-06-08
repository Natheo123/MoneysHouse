import { getAdminMembers } from "@/lib/admin-store";
import { getTeamMembersServer } from "@/lib/team-store";
import { isValidDiscordId, type TeamRole } from "@/lib/team-shared";

const STAFF_TEAM_ROLES: TeamRole[] = ["founder", "admin", "moderator"];

function parseRoleIdsEnv(): string[] {
  const raw = process.env.DISCORD_STAFF_ROLE_IDS ?? "";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseOwnerDiscordId(): string | undefined {
  const id = process.env.OWNER_DISCORD_ID?.trim();
  return id && isValidDiscordId(id) ? id : undefined;
}

export interface DiscordStaffPermissions {
  roleIds: string[];
  userIds: string[];
}

export async function getDiscordStaffPermissionsServer(): Promise<DiscordStaffPermissions> {
  const roleIds = parseRoleIdsEnv();
  const userIds = new Set<string>();

  const ownerId = parseOwnerDiscordId();
  if (ownerId) userIds.add(ownerId);

  const admins = await getAdminMembers();
  for (const admin of admins) {
    if (admin.discordId && isValidDiscordId(admin.discordId)) {
      userIds.add(admin.discordId);
    }
  }

  const team = await getTeamMembersServer();
  for (const member of team) {
    if (STAFF_TEAM_ROLES.includes(member.role) && isValidDiscordId(member.discordId)) {
      userIds.add(member.discordId);
    }
  }

  return {
    roleIds,
    userIds: [...userIds],
  };
}
