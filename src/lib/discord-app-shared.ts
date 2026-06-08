import type { StoredCustomApp } from "@/lib/custom-apps-shared";

export type DiscordPublishStatus = "none" | "pending" | "published" | "failed";

export interface DiscordAppJob extends StoredCustomApp {
  discordStatus?: DiscordPublishStatus;
  discordFrChannelId?: string;
  discordEnChannelId?: string;
  discordPublishedAt?: string;
  discordError?: string;
}

export function verifyDiscordBotSecret(authHeader: string | null): boolean {
  const secret = process.env.DISCORD_BOT_API_SECRET?.trim();
  if (!secret) return false;
  if (!authHeader?.startsWith("Bearer ")) return false;
  return authHeader.slice(7).trim() === secret;
}
