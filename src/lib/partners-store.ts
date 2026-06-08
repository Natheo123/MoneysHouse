import { promises as fs } from "fs";
import path from "path";
import {
  normalizePartner,
  parseStoredPartners,
  type Partner,
} from "@/lib/partners-shared";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readStoredPartnersFromGitHub,
  writeStoredPartnersToGitHub,
  type StoredPartners,
} from "@/lib/partners-github";

const PARTNERS_PATH = path.join(process.cwd(), "data", "partners.json");

async function readFilePartners(): Promise<Partner[]> {
  try {
    const content = await fs.readFile(PARTNERS_PATH, "utf-8");
    return parseStoredPartners(JSON.parse(content));
  } catch {
    return [];
  }
}

async function writeFilePartners(partners: Partner[]): Promise<void> {
  await fs.mkdir(path.dirname(PARTNERS_PATH), { recursive: true });
  await fs.writeFile(PARTNERS_PATH, `${JSON.stringify(partners, null, 2)}\n`, "utf-8");
}

async function readStored(): Promise<StoredPartners> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredPartnersFromGitHub();
      if (github) return github;
    } catch {
      // fallback
    }
  }
  return { partners: await readFilePartners(), source: "file" };
}

async function writeStored(stored: StoredPartners, partners: Partner[]): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredPartnersToGitHub(partners, stored.sha);
    return;
  }
  await writeFilePartners(partners);
}

async function mutate(
  fn: (current: Partner[]) => { partners: Partner[]; error?: string }
): Promise<{ ok: boolean; error?: string; partners?: Partner[] }> {
  try {
    const stored = await readStored();
    const { partners: next, error } = fn(stored.partners);
    if (error) return { ok: false, error };
    await writeStored(stored, next);
    return { ok: true, partners: parseStoredPartners(next) };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}

export async function getPartnersServer(): Promise<Partner[]> {
  const stored = await readStored();
  return stored.partners;
}

export async function upsertPartnerServer(
  raw: unknown
): Promise<{ ok: boolean; error?: string; partners?: Partner[]; partner?: Partner }> {
  const partner = normalizePartner(raw);
  if (!partner) return { ok: false, error: "Données partenaire invalides." };

  const result = await mutate((current) => {
    const idx = current.findIndex((p) => p.id === partner.id);
    const next = [...current];
    if (idx >= 0) next[idx] = partner;
    else next.unshift(partner);
    return { partners: next };
  });

  if (!result.ok) return result;
  return { ...result, partner };
}

export async function removePartnerServer(
  partnerId: string
): Promise<{ ok: boolean; error?: string; partners?: Partner[] }> {
  const id = partnerId.trim();
  return mutate((current) => {
    if (!current.some((p) => p.id === id)) {
      return { partners: current, error: "Partenaire introuvable." };
    }
    return { partners: current.filter((p) => p.id !== id) };
  });
}
