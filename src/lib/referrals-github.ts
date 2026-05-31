import { parseStoredEntry, type AppReferrals } from "@/lib/referrals-shared";

const REFERRALS_FILE = "data/referrals.json";

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

function parseReferrals(raw: unknown): Record<string, AppReferrals> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const result: Record<string, AppReferrals> = {};
  for (const [appId, value] of Object.entries(raw as Record<string, unknown>)) {
    result[appId] = parseStoredEntry(value);
  }
  return result;
}

export interface StoredReferrals {
  data: Record<string, AppReferrals>;
  sha?: string;
  source: "github" | "file";
}

export async function readStoredReferralsFromGitHub(): Promise<StoredReferrals | null> {
  const config = githubConfig();
  if (!config) return null;

  const url = `https://api.github.com/repos/${config.repo}/contents/${REFERRALS_FILE}?ref=${encodeURIComponent(config.branch)}`;
  const res = await fetch(url, {
    headers: githubHeaders(config.token),
    cache: "no-store",
  });

  if (res.status === 404) {
    return { data: {}, source: "github" };
  }

  if (!res.ok) {
    throw new Error(`Lecture GitHub impossible (${res.status}).`);
  }

  const payload = (await res.json()) as { content?: string; sha?: string };
  if (!payload.content) {
    return { data: {}, sha: payload.sha, source: "github" };
  }

  const decoded = Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf-8");
  const parsed = JSON.parse(decoded) as Record<string, unknown>;
  return {
    data: parseReferrals(parsed),
    sha: payload.sha,
    source: "github",
  };
}

export async function writeStoredReferralsToGitHub(
  data: Record<string, AppReferrals>,
  sha?: string
): Promise<void> {
  const config = githubConfig();
  if (!config) {
    throw new Error("GITHUB_TOKEN manquant.");
  }

  const payload = `${JSON.stringify(data, null, 2)}\n`;
  const body: Record<string, string> = {
    message: "chore: mise à jour des parrainages Money's House",
    content: Buffer.from(payload, "utf-8").toString("base64"),
    branch: config.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${config.repo}/contents/${REFERRALS_FILE}`,
    {
      method: "PUT",
      headers: {
        ...githubHeaders(config.token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Écriture GitHub impossible (${res.status}). ${detail.slice(0, 200)}`);
  }
}

export function hasGitHubPersistence(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

export function persistenceSetupHint(): string {
  if (hasGitHubPersistence()) return "";
  return "Sur Vercel, ajoutez GITHUB_TOKEN dans les variables d'environnement pour persister les parrainages.";
}
