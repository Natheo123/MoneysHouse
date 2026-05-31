import { normalizeEmail, OWNER_EMAIL } from "@/lib/admin-utils";
import {
  parseStoredAdmins,
  serializeStoredAdmins,
  type AdminMember,
} from "@/lib/admin-shared";

const ADMINS_FILE = "data/admins.json";

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

function withoutOwner(admins: AdminMember[]): AdminMember[] {
  const owner = normalizeEmail(OWNER_EMAIL);
  return admins.filter((admin) => admin.email !== owner);
}

export interface StoredAdmins {
  admins: AdminMember[];
  sha?: string;
  source: "github" | "file";
}

export async function readStoredAdminsFromGitHub(): Promise<StoredAdmins | null> {
  const config = githubConfig();
  if (!config) return null;

  const url = `https://api.github.com/repos/${config.repo}/contents/${ADMINS_FILE}?ref=${encodeURIComponent(config.branch)}`;
  const res = await fetch(url, {
    headers: githubHeaders(config.token),
    cache: "no-store",
  });

  if (res.status === 404) {
    return { admins: [], source: "github" };
  }

  if (!res.ok) {
    throw new Error(`Lecture GitHub impossible (${res.status}).`);
  }

  const data = (await res.json()) as { content?: string; sha?: string };
  if (!data.content) {
    return { admins: [], sha: data.sha, source: "github" };
  }

  const decoded = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
  const parsed = JSON.parse(decoded) as unknown;
  return {
    admins: parseStoredAdmins(parsed),
    sha: data.sha,
    source: "github",
  };
}

export async function writeStoredAdminsToGitHub(
  admins: AdminMember[],
  sha?: string
): Promise<void> {
  const config = githubConfig();
  if (!config) {
    throw new Error("GITHUB_TOKEN manquant.");
  }

  const payload = `${JSON.stringify(serializeStoredAdmins(withoutOwner(admins)), null, 2)}\n`;
  const body: Record<string, string> = {
    message: "chore: mise à jour des administrateurs Money's House",
    content: Buffer.from(payload, "utf-8").toString("base64"),
    branch: config.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${config.repo}/contents/${ADMINS_FILE}`,
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
  if (hasGitHubPersistence()) {
    return "";
  }
  return "Sur Vercel, ajoutez GITHUB_TOKEN (accès repo) dans les variables d'environnement, ou définissez EXTRA_ADMIN_EMAILS=email@exemple.com.";
}
