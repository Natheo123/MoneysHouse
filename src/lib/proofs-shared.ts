export interface ProofEntry {
  id: string;
  path: string;
  url: string;
  caption?: string;
  createdAt: string;
}

export type ProofsData = Record<string, ProofEntry[]>;

export type ProofImageExt = "jpg" | "png" | "webp" | "gif" | "bmp" | "avif";

const EXTENSION_TO_MIME: Record<ProofImageExt, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  avif: "image/avif",
};

const MIME_ALIASES: Record<string, ProofImageExt> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/x-png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/x-ms-bmp": "bmp",
  "image/avif": "avif",
};

/** Limite du corps de requête en production (~4,5 Mo). */
export const MAX_PROOF_BYTES = 4.5 * 1024 * 1024;

export const MIN_PROOF_BYTES = 1;

export function extensionForMime(mime: string): ProofImageExt | null {
  const normalized = mime.trim().toLowerCase();
  return MIME_ALIASES[normalized] ?? null;
}

export function mimeForExtension(ext: ProofImageExt): string {
  return EXTENSION_TO_MIME[ext];
}

export function extensionFromFileName(fileName: string): ProofImageExt | null {
  const match = fileName.toLowerCase().match(/\.(jpe?g|png|webp|gif|bmp|avif)$/);
  if (!match) return null;
  const ext = match[1];
  if (ext === "jpeg" || ext === "jpg") return "jpg";
  return ext as ProofImageExt;
}

/** Détecte le format réel via les octets du fichier (fiable sur Windows / mobile). */
export function detectProofImageType(
  buffer: Buffer,
  fileName = "",
  declaredMime = ""
): { ext: ProofImageExt; mime: string } | null {
  const fromDeclared = extensionForMime(declaredMime);
  if (fromDeclared && looksLikeFormat(buffer, fromDeclared)) {
    return { ext: fromDeclared, mime: mimeForExtension(fromDeclared) };
  }

  const fromMagic = detectFormatFromMagic(buffer);
  if (fromMagic) {
    return { ext: fromMagic, mime: mimeForExtension(fromMagic) };
  }

  const fromName = extensionFromFileName(fileName);
  if (fromName) {
    return { ext: fromName, mime: mimeForExtension(fromName) };
  }

  const fromDeclaredOnly = extensionForMime(declaredMime);
  if (fromDeclaredOnly) {
    return { ext: fromDeclaredOnly, mime: mimeForExtension(fromDeclaredOnly) };
  }

  return null;
}

function looksLikeFormat(buffer: Buffer, ext: ProofImageExt): boolean {
  const magic = detectFormatFromMagic(buffer);
  return magic === null || magic === ext;
}

function detectFormatFromMagic(buffer: Buffer): ProofImageExt | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return "gif";
  }
  if (buffer[0] === 0x42 && buffer[1] === 0x4d) return "bmp";

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "webp";
  }

  const header = buffer.subarray(4, 12).toString("ascii");
  if (header.startsWith("ftyp")) {
    const brand = buffer.subarray(8, 12).toString("ascii");
    if (brand.startsWith("avif") || brand.startsWith("avis")) return "avif";
  }

  return null;
}

export function isHeicLike(mime: string, fileName: string): boolean {
  const m = mime.toLowerCase();
  if (m.includes("heic") || m.includes("heif")) return true;
  return /\.heic$/i.test(fileName) || /\.heif$/i.test(fileName);
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

export const PROOF_ACCEPTED_FORMATS_LABEL =
  "JPG, PNG, WebP, GIF, BMP, AVIF — captures petites ou grandes, max 4,5 Mo";
