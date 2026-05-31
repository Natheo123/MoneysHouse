"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppRatingStats, Review } from "@/types";

export const REVIEWS_UPDATED_EVENT = "moneys-house-reviews-updated";

interface ReviewContextType {
  ready: boolean;
  reviews: Review[];
  refreshReviews: () => Promise<void>;
  getReviewsForApp: (appId: string) => Review[];
  getAppRatingStats: (appId: string) => AppRatingStats;
  getAllRatingStats: () => Record<string, AppRatingStats>;
  hasUserReviewedApp: (appId: string, userId: string) => boolean;
  addReview: (data: {
    appId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  removeReview: (reviewId: string, requestedBy: string) => Promise<{ ok: boolean; error?: string }>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

function computeStatsForApp(reviews: Review[], appId: string): AppRatingStats {
  const appReviews = reviews.filter((r) => r.appId === appId);
  if (appReviews.length === 0) return { average: 0, count: 0 };
  const sum = appReviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / appReviews.length) * 10) / 10,
    count: appReviews.length,
  };
}

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ready, setReady] = useState(false);

  const refreshReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { reviews?: Review[] };
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  const getReviewsForApp = useCallback(
    (appId: string) =>
      reviews
        .filter((r) => r.appId === appId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [reviews]
  );

  const getAppRatingStats = useCallback(
    (appId: string) => computeStatsForApp(reviews, appId),
    [reviews]
  );

  const getAllRatingStats = useCallback(() => {
    const map: Record<string, AppRatingStats> = {};
    for (const review of reviews) {
      if (!map[review.appId]) {
        map[review.appId] = computeStatsForApp(reviews, review.appId);
      }
    }
    return map;
  }, [reviews]);

  const hasUserReviewedApp = useCallback(
    (appId: string, userId: string) =>
      reviews.some((r) => r.appId === appId && r.userId === userId),
    [reviews]
  );

  const addReview = useCallback(
    async (data: {
      appId: string;
      userId: string;
      userName: string;
      rating: number;
      comment: string;
    }) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", ...data }),
      });
      const result = (await res.json()) as { ok: boolean; error?: string; reviews?: Review[] };
      if (result.ok && result.reviews) {
        setReviews(result.reviews);
        window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
      }
      return { ok: result.ok, error: result.error };
    },
    []
  );

  const removeReview = useCallback(async (reviewId: string, requestedBy: string) => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", id: reviewId, requestedBy }),
    });
    const result = (await res.json()) as { ok: boolean; error?: string; reviews?: Review[] };
    if (result.ok && result.reviews) {
      setReviews(result.reviews);
      window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
    }
    return { ok: result.ok, error: result.error };
  }, []);

  const value = useMemo(
    () => ({
      ready,
      reviews,
      refreshReviews,
      getReviewsForApp,
      getAppRatingStats,
      getAllRatingStats,
      hasUserReviewedApp,
      addReview,
      removeReview,
    }),
    [
      ready,
      reviews,
      refreshReviews,
      getReviewsForApp,
      getAppRatingStats,
      getAllRatingStats,
      hasUserReviewedApp,
      addReview,
      removeReview,
    ]
  );

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewProvider");
  return ctx;
}
