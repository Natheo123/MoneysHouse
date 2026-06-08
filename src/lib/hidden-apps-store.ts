import { promises as fs } from "fs";
import path from "path";
import { parseHiddenAppIds } from "@/lib/hidden-apps-shared";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readStoredHiddenAppsFromGitHub,
  writeStoredHiddenAppsToGitHub,
  type StoredHiddenApps,
} from "@/lib/hidden-apps-github";

const HIDDEN_APPS_PATH = path.join(process.cwd(), "data", "hidden-apps.json");

async function readFileHiddenApps(): Promise<string[]> {
  try {
    const content = await fs.readFile(HIDDEN_APPS_PATH, "utf-8");
    return parseHiddenAppIds(JSON.parse(content));
  } catch {
    return [];
  }
}

async function writeFileHiddenApps(ids: string[]): Promise<void> {
  await fs.mkdir(path.dirname(HIDDEN_APPS_PATH), { recursive: true });
  await fs.writeFile(HIDDEN_APPS_PATH, `${JSON.stringify(ids, null, 2)}\n`, "utf-8");
}

async function readStored(): Promise<StoredHiddenApps> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredHiddenAppsFromGitHub();
      if (github) return github;
    } catch {
      // fallback fichier
    }
  }
  return { ids: await readFileHiddenApps(), source: "file" };
}

async function writeStored(stored: StoredHiddenApps, ids: string[]): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredHiddenAppsToGitHub(ids, stored.sha);
    return;
  }
  await writeFileHiddenApps(ids);
}

async function mutate(
  fn: (current: string[]) => { ids: string[]; error?: string }
): Promise<{ ok: boolean; error?: string; ids?: string[] }> {
  try {
    const stored = await readStored();
    const { ids: next, error } = fn(stored.ids);
    if (error) return { ok: false, error };
    await writeStored(stored, next);
    return { ok: true, ids: next };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}

export async function getHiddenAppIdsServer(): Promise<string[]> {
  const stored = await readStored();
  return stored.ids;
}

export async function hideAppServer(
  appId: string
): Promise<{ ok: boolean; error?: string; ids?: string[] }> {
  const id = appId.trim();
  if (!id) return { ok: false, error: "Application introuvable." };

  return mutate((current) => {
    if (current.includes(id)) {
      return { ids: current, error: "Cette application est déjà masquée." };
    }
    return { ids: [...current, id] };
  });
}

export async function restoreAppServer(
  appId: string
): Promise<{ ok: boolean; error?: string; ids?: string[] }> {
  const id = appId.trim();
  return mutate((current) => {
    if (!current.includes(id)) {
      return { ids: current, error: "Cette application n'est pas masquée." };
    }
    return { ids: current.filter((entry) => entry !== id) };
  });
}
