import type { DiscordPublishStatus } from "@/lib/discord-app-shared";

export interface DiscordPublishRecord {
  discordStatus: DiscordPublishStatus;
  discordFrChannelId?: string;
  discordEnChannelId?: string;
  discordPublishedAt?: string;
  discordError?: string;
  requestedAt?: string;
}

export type DiscordPublishMap = Record<string, DiscordPublishRecord>;

export function parseDiscordPublishMap(raw: unknown): DiscordPublishMap {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  const result: DiscordPublishMap = {};
  for (const [appId, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") continue;
    const entry = value as Record<string, unknown>;
    const status = entry.discordStatus;
    if (
      status !== "none" &&
      status !== "pending" &&
      status !== "published" &&
      status !== "failed"
    ) {
      continue;
    }
    result[appId] = {
      discordStatus: status,
      discordFrChannelId:
        typeof entry.discordFrChannelId === "string" ? entry.discordFrChannelId : undefined,
      discordEnChannelId:
        typeof entry.discordEnChannelId === "string" ? entry.discordEnChannelId : undefined,
      discordPublishedAt:
        typeof entry.discordPublishedAt === "string" ? entry.discordPublishedAt : undefined,
      discordError: typeof entry.discordError === "string" ? entry.discordError : undefined,
      requestedAt: typeof entry.requestedAt === "string" ? entry.requestedAt : undefined,
    };
  }
  return result;
}
