import { promises as fs } from "fs";
import path from "path";
import {
  normalizeCustomApp,
  parseStoredCustomApps,
  type StoredCustomApp,
} from "@/lib/custom-apps-shared";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readStoredCustomAppsFromGitHub,
  writeStoredCustomAppsToGitHub,
  type StoredCustomApps,
} from "@/lib/custom-apps-github";

const CUSTOM_APPS_PATH = path.join(process.cwd(), "data", "custom-apps.json");

async function readFileCustomApps(): Promise<StoredCustomApp[]> {
  try {
    const content = await fs.readFile(CUSTOM_APPS_PATH, "utf-8");
    return parseStoredCustomApps(JSON.parse(content));
  } catch {
    return [];
  }
}

async function writeFileCustomApps(apps: StoredCustomApp[]): Promise<void> {
  await fs.mkdir(path.dirname(CUSTOM_APPS_PATH), { recursive: true });
  await fs.writeFile(CUSTOM_APPS_PATH, `${JSON.stringify(apps, null, 2)}\n`, "utf-8");
}

async function readStored(): Promise<StoredCustomApps> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredCustomAppsFromGitHub();
      if (github) return github;
    } catch {
      // fallback fichier
    }
  }
  return { apps: await readFileCustomApps(), source: "file" };
}

async function writeStored(stored: StoredCustomApps, apps: StoredCustomApp[]): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredCustomAppsToGitHub(apps, stored.sha);
    return;
  }
  await writeFileCustomApps(apps);
}

async function mutate(
  fn: (current: StoredCustomApp[]) => { apps: StoredCustomApp[]; error?: string }
): Promise<{ ok: boolean; error?: string; apps?: StoredCustomApp[] }> {
  try {
    const stored = await readStored();
    const { apps: next, error } = fn(stored.apps);
    if (error) return { ok: false, error };
    await writeStored(stored, next);
    return { ok: true, apps: next };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}

export async function getCustomAppsServer(): Promise<StoredCustomApp[]> {
  const stored = await readStored();
  return stored.apps;
}

export async function upsertCustomAppServer(
  raw: unknown
): Promise<{ ok: boolean; error?: string; apps?: StoredCustomApp[]; app?: StoredCustomApp }> {
  const app = normalizeCustomApp(raw);
  if (!app) return { ok: false, error: "Données d'application invalides." };

  const rawObj = (raw && typeof raw === "object" ? raw : {}) as Partial<StoredCustomApp>;

  const result = await mutate((current) => {
    const idx = current.findIndex((a) => a.id === app.id);
    const next = [...current];
    if (idx >= 0) {
      const prev = current[idx];
      next[idx] = {
        ...app,
        discordStatus:
          rawObj.discordStatus !== undefined ? app.discordStatus : prev.discordStatus ?? "none",
        discordFrChannelId:
          rawObj.discordFrChannelId !== undefined ? app.discordFrChannelId : prev.discordFrChannelId,
        discordEnChannelId:
          rawObj.discordEnChannelId !== undefined ? app.discordEnChannelId : prev.discordEnChannelId,
        discordPublishedAt:
          rawObj.discordPublishedAt !== undefined ? app.discordPublishedAt : prev.discordPublishedAt,
        discordError: rawObj.discordError !== undefined ? app.discordError : prev.discordError,
      };
    } else {
      next.unshift({ ...app, discordStatus: app.discordStatus ?? "none" });
    }
    return { apps: next };
  });

  if (!result.ok) return result;
  return { ...result, app };
}

export async function removeCustomAppServer(
  appId: string
): Promise<{ ok: boolean; error?: string; apps?: StoredCustomApp[] }> {
  const id = appId.trim();
  return mutate((current) => {
    if (!current.some((a) => a.id === id)) {
      return { apps: current, error: "Application introuvable." };
    }
    return { apps: current.filter((a) => a.id !== id) };
  });
}

export async function requestDiscordPublishServer(
  appId: string
): Promise<{ ok: boolean; error?: string; apps?: StoredCustomApp[]; app?: StoredCustomApp }> {
  const id = appId.trim();
  const result = await mutate((current) => {
    const idx = current.findIndex((a) => a.id === id);
    if (idx < 0) return { apps: current, error: "Application introuvable." };

    const app = current[idx];
    if (app.discordStatus === "published") {
      const next = [...current];
      next[idx] = {
        ...app,
        discordStatus: "pending",
        discordError: undefined,
      };
      return { apps: next };
    }

    if (app.discordStatus === "pending") {
      return { apps: current, error: "Publication Discord déjà en attente." };
    }

    const next = [...current];
    next[idx] = {
      ...app,
      discordStatus: "pending",
      discordError: undefined,
    };
    return { apps: next };
  });

  if (!result.ok) return result;
  const app = result.apps?.find((a) => a.id === id);
  return { ...result, app };
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
    const idx = current.findIndex((a) => a.id === id);
    if (idx < 0) return { apps: current, error: "Application introuvable." };

    const app = current[idx];
    const next = [...current];

    if (payload.ok) {
      next[idx] = {
        ...app,
        discordStatus: "published",
        discordFrChannelId: payload.frChannelId,
        discordEnChannelId: payload.enChannelId,
        discordPublishedAt: new Date().toISOString(),
        discordError: undefined,
      };
    } else {
      next[idx] = {
        ...app,
        discordStatus: "failed",
        discordError: payload.error ?? "Échec de publication Discord.",
      };
    }

    return { apps: next };
  });
}

export async function getDiscordPendingAppsServer(): Promise<StoredCustomApp[]> {
  const apps = await getCustomAppsServer();
  return apps.filter((a) => a.discordStatus === "pending");
}
