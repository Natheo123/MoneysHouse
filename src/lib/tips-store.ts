import { promises as fs } from "fs";
import path from "path";
import {
  DEFAULT_TIPS_SETTINGS,
  isValidPaypalUrl,
  normalizePaypalUrl,
  normalizeTipsSettings,
  type TipsSettings,
} from "@/lib/tips-shared";
import {
  hasGitHubPersistence,
  persistenceSetupHint,
  readStoredTipsFromGitHub,
  writeStoredTipsToGitHub,
  type StoredTips,
} from "@/lib/tips-github";

const TIPS_PATH = path.join(process.cwd(), "data", "tips.json");

async function readFileTips(): Promise<TipsSettings> {
  try {
    const content = await fs.readFile(TIPS_PATH, "utf-8");
    return normalizeTipsSettings(JSON.parse(content));
  } catch {
    return { ...DEFAULT_TIPS_SETTINGS };
  }
}

async function writeFileTips(settings: TipsSettings): Promise<void> {
  await fs.mkdir(path.dirname(TIPS_PATH), { recursive: true });
  await fs.writeFile(TIPS_PATH, `${JSON.stringify(settings, null, 2)}\n`, "utf-8");
}

async function readStored(): Promise<StoredTips> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredTipsFromGitHub();
      if (github) return github;
    } catch {
      // fallback fichier
    }
  }
  return { settings: await readFileTips(), source: "file" };
}

async function writeStored(stored: StoredTips, settings: TipsSettings): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredTipsToGitHub(settings, stored.sha);
    return;
  }
  await writeFileTips(settings);
}

export async function getTipsServer(): Promise<TipsSettings> {
  const stored = await readStored();
  return stored.settings;
}

export async function updateTipsServer(
  raw: unknown
): Promise<{ ok: boolean; error?: string; settings?: TipsSettings }> {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Données invalides." };
  }

  const input = raw as Partial<TipsSettings>;
  const paypalUrl =
    typeof input.paypalUrl === "string" ? normalizePaypalUrl(input.paypalUrl) : "";
  const wantsEnabled = Boolean(input.enabled);

  if (wantsEnabled && !paypalUrl) {
    return { ok: false, error: "Un lien PayPal est requis pour activer les tips." };
  }
  if (paypalUrl && !isValidPaypalUrl(paypalUrl)) {
    return {
      ok: false,
      error: "Lien PayPal invalide (utilisez paypal.me ou paypal.com).",
    };
  }

  const settings: TipsSettings = {
    enabled: wantsEnabled && Boolean(paypalUrl),
    paypalUrl,
    updatedAt: new Date().toISOString().split("T")[0],
  };

  try {
    const stored = await readStored();
    await writeStored(stored, settings);
    return { ok: true, settings };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}
