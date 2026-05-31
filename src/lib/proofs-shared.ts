export interface ProofEntry {
  id: string;
  path: string;
  url: string;
  caption?: string;
  createdAt: string;
}

export type ProofsData = Record<string, ProofEntry[]>;

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_PROOF_BYTES = 4 * 1024 * 1024;

export function extensionForMime(mime: string): string | null {
  return ALLOWED_MIME[mime] ?? null;
}

export function isAllowedProofMime(mime: string): boolean {
  return mime in ALLOWED_MIME;
}

export function parseProofEntry(value: unknown): ProofEntry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.path !== "string" || typeof row.url !== "string") {
    return null;
  }
  return {
    id: row.id,
    path: row.path,
    url: row.url,
    caption: typeof row.caption === "string" ? row.caption : undefined,
    createdAt: typeof row.createdAt === "string" ? row.createdAt : new Date().toISOString(),
  };
}

export function parseProofsData(raw: unknown): ProofsData {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const result: ProofsData = {};
  for (const [appId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue;
    const entries = value.map(parseProofEntry).filter((e): e is ProofEntry => e !== null);
    if (entries.length > 0) result[appId] = entries;
  }
  return result;
}

export function getProofPublicUrl(repoPath: string): string {
  const repo = process.env.GITHUB_REPO ?? "Natheo123/MoneysHouse";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (process.env.GITHUB_TOKEN) {
    return `https://raw.githubusercontent.com/${repo}/${branch}/${repoPath}`;
  }
  return `/${repoPath.replace(/^public\//, "")}`;
}
