import { normalizeTipsSettings, type TipsSettings } from "@/lib/tips-shared";

const TIPS_FILE = "data/tips.json";

function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return {
    token,
    repo: process.env.GITHUB_REPO ?? "Natheo123/MoneysHouse",
    branch: process.env.GITHUB_BRANCH ?? "main",
  };
}

function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export interface StoredTips {
  settings: TipsSettings;
  sha?: string;
  source: "github" | "file";
}

export async function readStoredTipsFromGitHub(): Promise<StoredTips | null> {
  const config = githubConfig();
  if (!config) return null;

  const url = `https://api.github.com/repos/${config.repo}/contents/${TIPS_FILE}?ref=${encodeURIComponent(config.branch)}`;
  const res = await fetch(url, {
    headers: githubHeaders(config.token),
    cache: "no-store",
  });

  if (res.status === 404) {
    return { settings: normalizeTipsSettings({}), source: "github" };
  }
  if (!res.ok) throw new Error(`Lecture tips impossible (${res.status}).`);

  const payload = (await res.json()) as { content?: string; sha?: string };
  if (!payload.content) {
    return { settings: normalizeTipsSettings({}), sha: payload.sha, source: "github" };
  }

  const decoded = Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf-8");
  return {
    settings: normalizeTipsSettings(JSON.parse(decoded)),
    sha: payload.sha,
    source: "github",
  };
}

export async function writeStoredTipsToGitHub(settings: TipsSettings, sha?: string): Promise<void> {
  const config = githubConfig();
  if (!config) throw new Error("Configuration de persistance manquante.");

  const payload = `${JSON.stringify(settings, null, 2)}\n`;
  const body: Record<string, string> = {
    message: "chore: mise à jour des tips Money's House",
    content: Buffer.from(payload, "utf-8").toString("base64"),
    branch: config.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${config.repo}/contents/${TIPS_FILE}`, {
    method: "PUT",
    headers: { ...githubHeaders(config.token), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Enregistrement impossible (${res.status}). ${detail.slice(0, 200)}`);
  }
}

export function hasGitHubPersistence(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

export function persistenceSetupHint(): string {
  if (hasGitHubPersistence()) return "";
  return "La sauvegarde des tips n'est pas disponible en production.";
}
