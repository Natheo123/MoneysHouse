import { parseProofsData, type ProofsData } from "@/lib/proofs-shared";

const PROOFS_FILE = "data/proofs.json";

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

export interface StoredProofs {
  data: ProofsData;
  sha?: string;
  source: "github" | "file";
}

export interface GitHubFileMeta {
  sha: string;
}

export async function readGitHubTextFile(
  filePath: string
): Promise<{ content: string; sha?: string } | null> {
  const config = githubConfig();
  if (!config) return null;

  const url = `https://api.github.com/repos/${config.repo}/contents/${filePath}?ref=${encodeURIComponent(config.branch)}`;
  const res = await fetch(url, {
    headers: githubHeaders(config.token),
    cache: "no-store",
  });

  if (res.status === 404) return { content: "", sha: undefined };
  if (!res.ok) throw new Error(`Lecture GitHub impossible (${res.status}).`);

  const payload = (await res.json()) as { content?: string; sha?: string };
  if (!payload.content) return { content: "", sha: payload.sha };
  const decoded = Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf-8");
  return { content: decoded, sha: payload.sha };
}

export async function readStoredProofsFromGitHub(): Promise<StoredProofs | null> {
  const file = await readGitHubTextFile(PROOFS_FILE);
  if (file === null) return null;

  if (!file.content.trim()) {
    return { data: {}, sha: file.sha, source: "github" };
  }

  const parsed = JSON.parse(file.content) as unknown;
  return { data: parseProofsData(parsed), sha: file.sha, source: "github" };
}

export async function writeStoredProofsToGitHub(data: ProofsData, sha?: string): Promise<void> {
  const config = githubConfig();
  if (!config) throw new Error("GITHUB_TOKEN manquant.");

  const payload = `${JSON.stringify(data, null, 2)}\n`;
  await putGitHubBinaryFile(PROOFS_FILE, Buffer.from(payload, "utf-8"), sha, "chore: mise à jour des preuves Money's House");
}

export async function getGitHubFileSha(filePath: string): Promise<string | null> {
  const config = githubConfig();
  if (!config) return null;

  const url = `https://api.github.com/repos/${config.repo}/contents/${filePath}?ref=${encodeURIComponent(config.branch)}`;
  const res = await fetch(url, {
    headers: githubHeaders(config.token),
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Lecture GitHub impossible (${res.status}).`);

  const payload = (await res.json()) as GitHubFileMeta;
  return payload.sha;
}

export async function putGitHubBinaryFile(
  filePath: string,
  content: Buffer,
  sha?: string,
  message = "chore: ajout preuve Money's House"
): Promise<void> {
  const config = githubConfig();
  if (!config) throw new Error("GITHUB_TOKEN manquant.");

  const body: Record<string, string> = {
    message,
    content: content.toString("base64"),
    branch: config.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${config.repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      ...githubHeaders(config.token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Écriture GitHub impossible (${res.status}). ${detail.slice(0, 200)}`);
  }
}

export async function deleteGitHubFile(
  filePath: string,
  sha: string,
  message = "chore: suppression preuve Money's House"
): Promise<void> {
  const config = githubConfig();
  if (!config) throw new Error("GITHUB_TOKEN manquant.");

  const res = await fetch(`https://api.github.com/repos/${config.repo}/contents/${filePath}`, {
    method: "DELETE",
    headers: {
      ...githubHeaders(config.token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      sha,
      branch: config.branch,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Suppression GitHub impossible (${res.status}). ${detail.slice(0, 200)}`);
  }
}

export function hasGitHubPersistence(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

export function persistenceSetupHint(): string {
  if (hasGitHubPersistence()) return "";
  return "Sur Vercel, ajoutez GITHUB_TOKEN pour persister les preuves.";
}
