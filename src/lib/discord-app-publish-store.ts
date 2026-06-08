import { promises as fs } from "fs";
import path from "path";
import { getAllAppsServer } from "@/lib/apps-catalog-server";
import { buildDiscordAppJobPayload } from "@/lib/discord-app-guide";
import type { DiscordAppJobPayload } from "@/lib/discord-app-guide";
import { getCustomAppsServer } from "@/lib/custom-apps-store";
import type { StoredCustomApp } from "@/lib/custom-apps-shared";
import {
  parseDiscordPublishMap,
  type DiscordPublishMap,
  type DiscordPublishRecord,
} from "@/lib/discord-app-publish-shared";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readStoredDiscordPublishFromGitHub,
  writeStoredDiscordPublishToGitHub,
  type StoredDiscordPublish,
} from "@/lib/discord-app-publish-github";

const DISCORD_PUBLISH_PATH = path.join(process.cwd(), "data", "discord-app-publish.json");

async function readFileDiscordPublish(): Promise<DiscordPublishMap> {
  try {
    const content = await fs.readFile(DISCORD_PUBLISH_PATH, "utf-8");
    return parseDiscordPublishMap(JSON.parse(content));
  } catch {
    return {};
  }
}

async function writeFileDiscordPublish(data: DiscordPublishMap): Promise<void> {
  await fs.mkdir(path.dirname(DISCORD_PUBLISH_PATH), { recursive: true });
  await fs.writeFile(DISCORD_PUBLISH_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

async function readStored(): Promise<StoredDiscordPublish> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredDiscordPublishFromGitHub();
      if (github) return github;
    } catch {
      // fallback fichier
    }
  }
  return { data: await readFileDiscordPublish(), source: "file" };
}

async function writeStored(stored: StoredDiscordPublish, data: DiscordPublishMap): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredDiscordPublishToGitHub(data, stored.sha);
    return;
  }
  await writeFileDiscordPublish(data);
}

function mergeLegacyCustomDiscordState(
  data: DiscordPublishMap,
  customApps: StoredCustomApp[]
): DiscordPublishMap {
  const next = { ...data };
  for (const app of customApps) {
    if (!app.discordStatus || app.discordStatus === "none") continue;
    if (next[app.id]?.discordStatus) continue;
    next[app.id] = {
      discordStatus: app.discordStatus,
      discordFrChannelId: app.discordFrChannelId,
      discordEnChannelId: app.discordEnChannelId,
      discordPublishedAt: app.discordPublishedAt,
      discordError: app.discordError,
    };
  }
  return next;
}

async function mutate(
  fn: (current: DiscordPublishMap) => { data: DiscordPublishMap; error?: string }
): Promise<{ ok: boolean; error?: string; discordPublish?: DiscordPublishMap }> {
  try {
    const stored = await readStored();
    const customApps = await getCustomAppsServer();
    const merged = mergeLegacyCustomDiscordState(stored.data, customApps);
    const { data: next, error } = fn(merged);
    if (error) return { ok: false, error };
    await writeStored(stored, next);
    return { ok: true, discordPublish: next };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}

export async function getDiscordPublishMapServer(): Promise<DiscordPublishMap> {
  const stored = await readStored();
  const customApps = await getCustomAppsServer();
  return mergeLegacyCustomDiscordState(stored.data, customApps);
}

export async function getDiscordPublishRecordServer(
  appId: string
): Promise<DiscordPublishRecord | undefined> {
  const map = await getDiscordPublishMapServer();
  return map[appId];
}

async function resolveCatalogApp(appId: string) {
  const id = appId.trim();
  const catalog = await getAllAppsServer();
  const app = catalog.find((entry) => entry.id === id);
  if (!app) return { error: "Application introuvable." as const };
  return { app };
}

function queueRecord(existing?: DiscordPublishRecord): DiscordPublishRecord {
  return {
    discordStatus: "pending",
    discordFrChannelId: existing?.discordFrChannelId,
    discordEnChannelId: existing?.discordEnChannelId,
    discordPublishedAt: existing?.discordPublishedAt,
    discordError: undefined,
    requestedAt: new Date().toISOString(),
  };
}

export async function requestDiscordPublishServer(
  appId: string
): Promise<{ ok: boolean; error?: string; discordPublish?: DiscordPublishMap }> {
  const resolved = await resolveCatalogApp(appId);
  if ("error" in resolved) return { ok: false, error: resolved.error };

  return mutate((current) => ({
    data: {
      ...current,
      [resolved.app.id]: queueRecord(current[resolved.app.id]),
    },
  }));
}

export async function requestAllDiscordPublishServer(): Promise<{
  ok: boolean;
  error?: string;
  discordPublish?: DiscordPublishMap;
  queuedCount?: number;
}> {
  const catalog = await getAllAppsServer();
  if (catalog.length === 0) {
    return { ok: false, error: "Aucune application à publier." };
  }

  const result = await mutate((current) => {
    const next = { ...current };
    for (const app of catalog) {
      next[app.id] = queueRecord(current[app.id]);
    }
    return { data: next };
  });

  if (!result.ok) return result;
  return { ...result, queuedCount: catalog.length };
}

export async function completeDiscordPublishServer(
  appId: string,
  payload: {
    ok: boolean;
    frChannelId?: string;
    enChannelId?: string;
    error?: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  const id = appId.trim();
  return mutate((current) => {
    if (!(id in current) && !payload.ok) {
      return { data: current, error: "Application introuvable." };
    }

    const existing = current[id];
    const next = { ...current };

    if (payload.ok) {
      next[id] = {
        discordStatus: "published",
        discordFrChannelId: payload.frChannelId,
        discordEnChannelId: payload.enChannelId,
        discordPublishedAt: new Date().toISOString(),
        discordError: undefined,
        requestedAt: existing?.requestedAt,
      };
    } else {
      next[id] = {
        discordStatus: "failed",
        discordFrChannelId: existing?.discordFrChannelId,
        discordEnChannelId: existing?.discordEnChannelId,
        discordPublishedAt: existing?.discordPublishedAt,
        discordError: payload.error ?? "Échec de publication Discord.",
        requestedAt: existing?.requestedAt,
      };
    }

    return { data: next };
  });
}

export async function getDiscordPendingJobsServer(): Promise<DiscordAppJobPayload[]> {
  const [map, catalog] = await Promise.all([getDiscordPublishMapServer(), getAllAppsServer()]);
  const catalogById = new Map(catalog.map((app) => [app.id, app]));

  const jobs: DiscordAppJobPayload[] = [];
  for (const [appId, record] of Object.entries(map)) {
    if (record.discordStatus !== "pending") continue;
    const app = catalogById.get(appId);
    if (!app) continue;
    jobs.push(buildDiscordAppJobPayload(app));
  }

  return jobs;
}
