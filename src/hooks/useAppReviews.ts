"use client";

import { useEffect, useState } from "react";
import type { AppRatingStats, Review } from "@/types";
import {
  getReviewsForApp,
  getAppRatingStats,
  addReview as persistReview,
  hasUserReviewedApp,
} from "@/lib/reviews";

export function useAppReviews(appId: string, userId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<AppRatingStats>({ average: 0, count: 0 });
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const refresh = () => {
    setReviews(getReviewsForApp(appId));
    setStats(getAppRatingStats(appId));
    if (userId) setAlreadyReviewed(hasUserReviewedApp(appId, userId));
  };

  useEffect(() => {
    refresh();
  }, [appId, userId]);

  const submitReview = (data: {
    userId: string;
    userName: string;
    rating: number;
    comment: string;
  }) => {
    if (hasUserReviewedApp(appId, data.userId)) return false;
    persistReview({ appId, ...data });
    refresh();
    return true;
  };

  return { reviews, stats, alreadyReviewed, submitReview, refresh };
}
