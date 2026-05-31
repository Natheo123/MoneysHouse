"use client";

import { useMemo } from "react";
import { useReviews } from "@/context/ReviewContext";

export function useAppReviews(appId: string, userId?: string) {
  const {
    ready,
    getReviewsForApp,
    getAppRatingStats,
    hasUserReviewedApp,
    addReview,
    removeReview,
    refreshReviews,
  } = useReviews();

  const reviews = getReviewsForApp(appId);
  const stats = getAppRatingStats(appId);
  const alreadyReviewed = userId ? hasUserReviewedApp(appId, userId) : false;

  return useMemo(
    () => ({
      ready,
      reviews,
      stats,
      alreadyReviewed,
      submitReview: async (data: {
        userId: string;
        userName: string;
        rating: number;
        comment: string;
      }) => {
        if (hasUserReviewedApp(appId, data.userId)) {
          return { ok: false as const, error: "duplicate" as const };
        }
        const result = await addReview({ appId, ...data });
        return result.ok ? { ok: true as const } : { ok: false as const, error: result.error };
      },
      removeReview: (reviewId: string, requestedBy: string) => removeReview(reviewId, requestedBy),
      refresh: refreshReviews,
    }),
    [
      ready,
      reviews,
      stats,
      alreadyReviewed,
      appId,
      addReview,
      removeReview,
      refreshReviews,
      hasUserReviewedApp,
    ]
  );
}
