import { promises as fs } from "fs";
import path from "path";
import { apps } from "@/lib/data/apps";
import {
  isValidLink,
  mergeReferralsWithAppDefaults,
  normalizeAppReferrals,
  normalizeLink,
  parseStoredEntry,
  type AppReferrals,
} from "@/lib/referrals-shared";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readStoredReferralsFromGitHub,
  writeStoredReferralsToGitHub,
  type StoredReferrals,
} from "@/lib/referrals-github";

const REFERRALS_PATH = path.join(process.cwd(), "data", "referrals.json");

async function readFileReferrals(): Promise<Record<string, AppReferrals>> {
  try {
    const content = await fs.readFile(REFERRALS_PATH, "utf-8");
    const parsed = JSON.parse(content) as Record<string, unknown>;
    const result: Record<string, AppReferrals> = {};
    for (const [appId, value] of Object.entries(parsed)) {
      result[appId] = parseStoredEntry(value);
    }
    return result;
  } catch {
    return {};
  }
}

async function writeFileReferrals(data: Record<string, AppReferrals>): Promise<void> {
  await fs.mkdir(path.dirname(REFERRALS_PATH), { recursive: true });
  await fs.writeFile(REFERRALS_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

async function readStoredReferrals(): Promise<StoredReferrals> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredReferralsFromGitHub();
      if (github) return github;
    } catch {
      // fallback fichier embarqué
    }
  }

  return {
    data: await readFileReferrals(),
    source: "file",
  };
}

async function writeStoredReferrals(
  stored: StoredReferrals,
  data: Record<string, AppReferrals>
): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredReferralsToGitHub(data, stored.sha);
    return;
  }
  await writeFileReferrals(data);
}

export async function getAllReferralDataServer(): Promise<Record<string, AppReferrals>> {
  const stored = await readStoredReferrals();
  const result: Record<string, AppReferrals> = {};
  for (const app of apps) {
    if (app.hasReferral === false) continue;
    result[app.id] = mergeReferralsWithAppDefaults(app.id, stored.data);
  }
  return result;
}

async function mutateReferrals(
  mutator: (current: Record<string, AppReferrals>) => {
    data: Record<string, AppReferrals>;
    error?: string;
  }
): Promise<{ ok: boolean; error?: string; referrals?: Record<string, AppReferrals> }> {
  try {
    const stored = await readStoredReferrals();
    const { data: next, error } = mutator(stored.data);
    if (error) return { ok: false, error };
    await writeStoredReferrals(stored, next);
    return { ok: true, referrals: await getAllReferralDataServer() };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}

function getEntry(
  current: Record<string, AppReferrals>,
  appId: string
): AppReferrals {
  return current[appId] ?? { codes: [], links: [] };
}

export async function addReferralCodeServer(
  appId: string,
  code: string
): Promise<{ ok: boolean; error?: string; referrals?: Record<string, AppReferrals> }> {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, error: "Code vide." };

  return mutateReferrals((current) => {
    const entry = getEntry(current, appId);
    if (entry.codes.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      return { data: current, error: "Code déjà enregistré." };
    }
    return {
      data: {
        ...current,
        [appId]: { ...entry, codes: [...entry.codes, trimmed] },
      },
    };
  });
}

export async function removeReferralCodeServer(
  appId: string,
  code: string
): Promise<{ ok: boolean; error?: string; referrals?: Record<string, AppReferrals> }> {
  return mutateReferrals((current) => {
    const entry = getEntry(current, appId);
    return {
      data: {
        ...current,
        [appId]: { ...entry, codes: entry.codes.filter((c) => c !== code) },
      },
    };
  });
}

export async function addReferralLinkServer(
  appId: string,
  link: string
): Promise<{ ok: boolean; error?: string; referrals?: Record<string, AppReferrals> }> {
  const normalized = normalizeLink(link);
  if (!normalized || !isValidLink(normalized)) {
    return { ok: false, error: "Lien invalide." };
  }

  return mutateReferrals((current) => {
    const entry = getEntry(current, appId);
    if (entry.links.some((l) => l.toLowerCase() === normalized.toLowerCase())) {
      return { data: current, error: "Lien déjà enregistré." };
    }
    return {
      data: {
        ...current,
        [appId]: { ...entry, links: [...entry.links, normalized] },
      },
    };
  });
}

export async function removeReferralLinkServer(
  appId: string,
  link: string
): Promise<{ ok: boolean; error?: string; referrals?: Record<string, AppReferrals> }> {
  return mutateReferrals((current) => {
    const entry = getEntry(current, appId);
    return {
      data: {
        ...current,
        [appId]: { ...entry, links: entry.links.filter((l) => l !== link) },
      },
    };
  });
}

export async function setReferralBonusServer(
  appId: string,
  bonus: { title: string; description: string }
): Promise<{ ok: boolean; error?: string; referrals?: Record<string, AppReferrals> }> {
  const title = bonus.title.trim();
  const description = bonus.description.trim();
  if (!title) return { ok: false, error: "Le titre du bonus est requis." };

  return mutateReferrals((current) => {
    const entry = getEntry(current, appId);
    return {
      data: {
        ...current,
        [appId]: { ...entry, bonusTitle: title, bonusDescription: description },
      },
    };
  });
}

export async function importReferralsServer(
  imported: Record<string, AppReferrals>
): Promise<{ ok: boolean; error?: string; referrals?: Record<string, AppReferrals> }> {
  return mutateReferrals((current) => {
    const merged = { ...current };
    for (const [appId, raw] of Object.entries(imported)) {
      const normalized = normalizeAppReferrals(raw);
      const existing = getEntry(merged, appId);
      merged[appId] = {
        codes: [...new Set([...existing.codes, ...normalized.codes])],
        links: [...new Set([...existing.links, ...normalized.links])],
        bonusTitle: normalized.bonusTitle || existing.bonusTitle,
        bonusDescription: normalized.bonusDescription || existing.bonusDescription,
      };
    }
    return { data: merged };
  });
}
