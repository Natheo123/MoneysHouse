import { promises as fs } from "fs";
import path from "path";
import type { Review, AppRatingStats } from "@/types";
import {
  hasGitHubPersistence,
  parseStoredReviews,
  persistenceSetupHint,
  readStoredReviewsFromGitHub,
  writeStoredReviewsToGitHub,
  type StoredReviews,
} from "@/lib/reviews-github";

const REVIEWS_PATH = path.join(process.cwd(), "data", "reviews.json");

async function readFileReviews(): Promise<Review[]> {
  try {
    const content = await fs.readFile(REVIEWS_PATH, "utf-8");
    return parseStoredReviews(JSON.parse(content));
  } catch {
    return [];
  }
}

async function writeFileReviews(reviews: Review[]): Promise<void> {
  await fs.mkdir(path.dirname(REVIEWS_PATH), { recursive: true });
  await fs.writeFile(REVIEWS_PATH, `${JSON.stringify(reviews, null, 2)}\n`, "utf-8");
}

async function readStoredReviews(): Promise<StoredReviews> {
  if (hasGitHubPersistence()) {
    try {
      const github = await readStoredReviewsFromGitHub();
      if (github) return github;
    } catch {
      // fallback fichier
    }
  }

  return {
    reviews: await readFileReviews(),
    source: "file",
  };
}

async function writeStoredReviews(stored: StoredReviews, reviews: Review[]): Promise<void> {
  if (hasGitHubPersistence()) {
    await writeStoredReviewsToGitHub(reviews, stored.sha);
    return;
  }
  await writeFileReviews(reviews);
}

async function mutateReviews(
  mutator: (current: Review[]) => { reviews: Review[]; error?: string }
): Promise<{ ok: boolean; error?: string; reviews?: Review[] }> {
  try {
    const stored = await readStoredReviews();
    const { reviews: next, error } = mutator(stored.reviews);
    if (error) return { ok: false, error };
    await writeStoredReviews(stored, next);
    return { ok: true, reviews: next };
  } catch (error) {
    const hint = persistenceSetupHint();
    const detail = error instanceof Error ? error.message : "Erreur inconnue.";
    return { ok: false, error: hint ? `${detail} ${hint}` : detail };
  }
}

export async function getAllReviewsServer(): Promise<Review[]> {
  const stored = await readStoredReviews();
  return stored.reviews.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getReviewsForAppServer(appId: string): Promise<Review[]> {
  return (await getAllReviewsServer()).filter((r) => r.appId === appId);
}

export function computeRatingStats(reviews: Review[], appId?: string): AppRatingStats | Record<string, AppRatingStats> {
  const filtered = appId ? reviews.filter((r) => r.appId === appId) : reviews;

  if (appId) {
    if (filtered.length === 0) return { average: 0, count: 0 };
    const sum = filtered.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: Math.round((sum / filtered.length) * 10) / 10,
      count: filtered.length,
    };
  }

  const map: Record<string, { sum: number; count: number }> = {};
  for (const r of filtered) {
    if (!map[r.appId]) map[r.appId] = { sum: 0, count: 0 };
    map[r.appId].sum += r.rating;
    map[r.appId].count += 1;
  }

  const result: Record<string, AppRatingStats> = {};
  for (const [id, { sum, count }] of Object.entries(map)) {
    result[id] = {
      average: Math.round((sum / count) * 10) / 10,
      count,
    };
  }
  return result;
}

export async function addReviewServer(
  review: Omit<Review, "id" | "date">
): Promise<{ ok: boolean; error?: string; review?: Review; reviews?: Review[] }> {
  const rating = Math.min(5, Math.max(1, Math.round(review.rating)));
  const comment = review.comment.trim();
  if (!comment) return { ok: false, error: "Le commentaire est requis." };
  if (!review.appId.trim()) return { ok: false, error: "Application requise." };

  return mutateReviews((current) => {
    if (current.some((r) => r.appId === review.appId && r.userId === review.userId)) {
      return { reviews: current, error: "Vous avez déjà laissé un avis pour cette application." };
    }

    const newReview: Review = {
      ...review,
      appId: review.appId.trim(),
      userName: review.userName.trim() || "Utilisateur",
      rating,
      comment,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
    };

    return { reviews: [newReview, ...current] };
  }).then((result) => {
    if (!result.ok || !result.reviews) return result;
    const added = result.reviews.find(
      (r) => r.appId === review.appId && r.userId === review.userId
    );
    return { ...result, review: added };
  });
}

export async function removeReviewServer(
  reviewId: string
): Promise<{ ok: boolean; error?: string; reviews?: Review[] }> {
  const id = reviewId.trim();
  return mutateReviews((current) => {
    if (!current.some((r) => r.id === id)) {
      return { reviews: current, error: "Avis introuvable." };
    }
    return { reviews: current.filter((r) => r.id !== id) };
  });
}
