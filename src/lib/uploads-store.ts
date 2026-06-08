import { promises as fs } from "fs";
import path from "path";
import {
  buildUploadRepoPath,
  detectUploadImageType,
  getUploadPublicUrl,
  MAX_UPLOAD_BYTES,
  MIN_UPLOAD_BYTES,
  type UploadKind,
} from "@/lib/uploads-shared";
import { getGitHubFileSha, hasGitHubPersistence, putGitHubBinaryFile } from "@/lib/proofs-github";

function isHeicLike(declaredMime: string, fileName: string): boolean {
  const lower = `${declaredMime} ${fileName}`.toLowerCase();
  return lower.includes("heic") || lower.includes("heif");
}

export async function uploadImageServer(
  kind: UploadKind,
  file: Buffer,
  fileName = "",
  declaredMime = "",
  nameHint = ""
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (file.byteLength < MIN_UPLOAD_BYTES) {
    return { ok: false, error: "Fichier vide ou illisible." };
  }
  if (file.byteLength > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `Image trop volumineuse (max ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} Mo).`,
    };
  }
  if (isHeicLike(declaredMime, fileName)) {
    return {
      ok: false,
      error: "Format HEIC/HEIF non supporté. Enregistrez l'image en JPG ou PNG.",
    };
  }

  const detected = detectUploadImageType(file, fileName, declaredMime);
  if (!detected) {
    return {
      ok: false,
      error: "Format non reconnu. Utilisez JPG, PNG, WebP, GIF, BMP ou AVIF.",
    };
  }

  const repoPath = buildUploadRepoPath(kind, nameHint, detected.ext);

  try {
    if (hasGitHubPersistence()) {
      const existingSha = await getGitHubFileSha(repoPath);
      await putGitHubBinaryFile(
        repoPath,
        file,
        existingSha ?? undefined,
        `chore: upload image ${kind} Money's House`
      );
    } else {
      const localPath = path.join(process.cwd(), repoPath);
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, file);
    }

    return { ok: true, url: getUploadPublicUrl(repoPath) };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: detail };
  }
}
