import type { Review, AppRatingStats } from "@/types";

const STORAGE_KEY = "moneys-house-reviews";

function loadReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function getReviewsForApp(appId: string): Review[] {
  return loadReviews()
    .filter((r) => r.appId === appId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAppRatingStats(appId: string): AppRatingStats {
  const reviews = getReviewsForApp(appId);
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

export function getAllRatingStats(): Record<string, AppRatingStats> {
  const reviews = loadReviews();
  const map: Record<string, { sum: number; count: number }> = {};
  for (const r of reviews) {
    if (!map[r.appId]) map[r.appId] = { sum: 0, count: 0 };
    map[r.appId].sum += r.rating;
    map[r.appId].count += 1;
  }
  const result: Record<string, AppRatingStats> = {};
  for (const [appId, { sum, count }] of Object.entries(map)) {
    result[appId] = {
      average: Math.round((sum / count) * 10) / 10,
      count,
    };
  }
  return result;
}

export function addReview(
  review: Omit<Review, "id" | "date">
): Review {
  const newReview: Review = {
    ...review,
    id: crypto.randomUUID(),
    date: new Date().toISOString().split("T")[0],
  };
  const all = loadReviews();
  saveReviews([newReview, ...all]);
  return newReview;
}

export function hasUserReviewedApp(appId: string, userId: string): boolean {
  return loadReviews().some((r) => r.appId === appId && r.userId === userId);
}
