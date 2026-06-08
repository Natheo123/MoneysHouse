import { randomUUID } from "crypto";
import {
  detectProofImageType,
  MAX_PROOF_BYTES,
  MIN_PROOF_BYTES,
  type ProofImageExt,
} from "@/lib/proofs-shared";

export type UploadKind = "partner" | "app";

export const MAX_UPLOAD_BYTES = MAX_PROOF_BYTES;
export const MIN_UPLOAD_BYTES = MIN_PROOF_BYTES;

export const UPLOAD_ACCEPTED_FORMATS_LABEL =
  "JPG, PNG, WebP, GIF, BMP, AVIF — max 4,5 Mo";

export function slugifyUploadName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function getUploadPublicUrl(repoPath: string): string {
  const repo = process.env.GITHUB_REPO ?? "Natheo123/MoneysHouse";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (process.env.GITHUB_TOKEN) {
    return `https://raw.githubusercontent.com/${repo}/${branch}/${repoPath}`;
  }
  return `/${repoPath.replace(/^public\//, "")}`;
}

export function detectUploadImageType(
  buffer: Buffer,
  fileName = "",
  declaredMime = ""
): { ext: ProofImageExt; mime: string } | null {
  return detectProofImageType(buffer, fileName, declaredMime);
}

export function buildUploadRepoPath(
  kind: UploadKind,
  nameHint: string,
  ext: ProofImageExt
): string {
  const folder = kind === "partner" ? "partners" : "apps";
  const base = slugifyUploadName(nameHint) || `image-${randomUUID().slice(0, 8)}`;
  return `public/uploads/${folder}/${base}.${ext}`;
}
