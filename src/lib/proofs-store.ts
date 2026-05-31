import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { apps } from "@/lib/data/apps";
import {
  detectProofImageType,
  getProofPublicUrl,
  isHeicLike,
  MAX_PROOF_BYTES,
  MIN_PROOF_BYTES,
  parseProofsData,
  type ProofEntry,
  type ProofsData,
} from "@/lib/proofs-shared";
import {
  deleteGitHubFile,
  getGitHubFileSha,
  hasGitHubPersistence,
  persistenceSetupHint,
  putGitHubBinaryFile,
  readStoredProofsFromGitHub,
  writeStoredProofsToGitHub,
  type StoredProofs,
} from "@/lib/proofs-github";

const PROOFS_PATH = path.join(process.cwd(), "data", "proofs.json");

async function readFileProofs(): Promise<ProofsData> {
  try {
    const content = await fs.readFile(PROOFS_PATH, "utf-8");
    return parseProofsData(JSON.parse(content) as unknown);
  } catch {
    return {};
  }
}

async function writeFileProofs(data: ProofsData): Promise<void> {
  await fs.mkdir(path.dirname(PROOFS_PATH), { recursive: true });
  await fs.writeFile(PROOFS_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

async function readStoredProofs(): Promise<StoredProofs> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredProofsFromGitHub();
      if (github) return github;
    } catch {
      // fallback fichier local
    }
  }

  return {
    data: await readFileProofs(),
    source: "file",
  };
}

async function writeStoredProofs(stored: StoredProofs, data: ProofsData): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredProofsToGitHub(data, stored.sha);
    return;
  }
  await writeFileProofs(data);
}

async function writeStoredProofsWithRetry(stored: StoredProofs, data: ProofsData): Promise<void> {
  let current = stored;
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await writeStoredProofs(current, data);
      return;
    } catch (error) {
      lastError = error;
      if (!hasGitHubPersistence() || attempt === 2) break;
      current = await readStoredProofs();
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Erreur lors de l'enregistrement.");
}

function isValidAppId(appId: string): boolean {
  return apps.some((app) => app.id === appId);
}

export async function getAllProofsServer(): Promise<ProofsData> {
  const stored = await readStoredProofs();
  return stored.data;
}

export async function getProofsForAppServer(appId: string): Promise<ProofEntry[]> {
  const all = await getAllProofsServer();
  return all[appId] ?? [];
}

async function writeProofImage(
  appId: string,
  id: string,
  ext: string,
  buffer: Buffer
): Promise<{ path: string; url: string }> {
  const repoPath = `public/proofs/${appId}/${id}.${ext}`;

  if (hasGitHubPersistence()) {
    await putGitHubBinaryFile(repoPath, buffer);
  } else {
    const localPath = path.join(process.cwd(), repoPath);
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, buffer);
  }

  return {
    path: repoPath,
    url: getProofPublicUrl(repoPath),
  };
}

async function deleteProofImage(repoPath: string): Promise<void> {
  if (hasGitHubPersistence()) {
    const sha = await getGitHubFileSha(repoPath);
    if (sha) await deleteGitHubFile(repoPath, sha);
    return;
  }

  const localPath = path.join(process.cwd(), repoPath);
  try {
    await fs.unlink(localPath);
  } catch {
    // fichier déjà absent
  }
}

export async function addProofServer(
  appId: string,
  file: Buffer,
  fileName = "",
  declaredMime = "",
  caption?: string
): Promise<{ ok: boolean; error?: string; proofs?: ProofEntry[] }> {
  if (!isValidAppId(appId)) {
    return { ok: false, error: "Application inconnue." };
  }

  if (file.byteLength < MIN_PROOF_BYTES) {
    return { ok: false, error: "Fichier vide ou illisible." };
  }
  if (file.byteLength > MAX_PROOF_BYTES) {
    return {
      ok: false,
      error: `Image trop volumineuse (max ${Math.round(MAX_PROOF_BYTES / (1024 * 1024))} Mo).`,
    };
  }

  if (isHeicLike(declaredMime, fileName)) {
    return {
      ok: false,
      error:
        "Format HEIC/HEIF non supporté. Enregistrez la capture en JPG ou PNG depuis votre téléphone.",
    };
  }

  const detected = detectProofImageType(file, fileName, declaredMime);
  if (!detected) {
    return {
      ok: false,
      error: "Format non reconnu. Utilisez JPG, PNG, WebP, GIF, BMP ou AVIF.",
    };
  }

  try {
    const stored = await readStoredProofs();
    const id = randomUUID();
    const { path: repoPath, url } = await writeProofImage(
      appId,
      id,
      detected.ext,
      file
    );

    const entry: ProofEntry = {
      id,
      path: repoPath,
      url,
      caption: caption?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const next: ProofsData = {
      ...stored.data,
      [appId]: [...(stored.data[appId] ?? []), entry],
    };

    await writeStoredProofsWithRetry(stored, next);
    return { ok: true, proofs: next[appId] };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}

export async function removeProofServer(
  appId: string,
  proofId: string
): Promise<{ ok: boolean; error?: string; proofs?: ProofEntry[] }> {
  if (!isValidAppId(appId)) {
    return { ok: false, error: "Application inconnue." };
  }

  try {
    const stored = await readStoredProofs();
    const entries = stored.data[appId] ?? [];
    const target = entries.find((p) => p.id === proofId);
    if (!target) return { ok: false, error: "Preuve introuvable." };

    await deleteProofImage(target.path);

    const remaining = entries.filter((p) => p.id !== proofId);
    const next: ProofsData = { ...stored.data };
    if (remaining.length > 0) {
      next[appId] = remaining;
    } else {
      delete next[appId];
    }

    await writeStoredProofsWithRetry(stored, next);
    return { ok: true, proofs: remaining };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}
