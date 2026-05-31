import type { DiscordProfile } from "@/lib/team-shared";

interface DiscordApiUser {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
  banner?: string | null;
  accent_color?: number | null;
}

function avatarUrl(user: DiscordApiUser): string {
  if (user.avatar) {
    const ext = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
  }
  const index = Number(user.id.slice(-1)) % 6;
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

function bannerUrl(user: DiscordApiUser): string | null {
  if (!user.banner) return null;
  const ext = user.banner.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=512`;
}

export async function fetchDiscordProfile(discordId: string): Promise<DiscordProfile | null> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
      headers: { Authorization: `Bot ${token}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    const user = (await res.json()) as DiscordApiUser;
    return {
      id: user.id,
      username: user.username,
      globalName: user.global_name ?? null,
      avatarUrl: avatarUrl(user),
      bannerUrl: bannerUrl(user),
      accentColor: user.accent_color ?? null,
      profileUrl: `https://discord.com/users/${user.id}`,
    };
  } catch {
    return null;
  }
}

export async function enrichTeamWithProfiles<T extends { discordId: string }>(
  members: T[]
): Promise<(T & { profile: DiscordProfile | null })[]> {
  return Promise.all(
    members.map(async (member) => ({
      ...member,
      profile: await fetchDiscordProfile(member.discordId),
    }))
  );
}
