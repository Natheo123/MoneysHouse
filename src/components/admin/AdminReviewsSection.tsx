"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import { apps } from "@/lib/data/apps";
import { useReviews } from "@/context/ReviewContext";
import { AdminAppSearchSelect } from "@/components/admin/AdminAppSearchSelect";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/context/LanguageContext";

interface AdminReviewsSectionProps {
  userEmail: string;
}

export function AdminReviewsSection({ userEmail }: AdminReviewsSectionProps) {
  const { t } = useTranslation();
  const { ready, reviews, getReviewsForApp, removeReview } = useReviews();
  const [selectedAppId, setSelectedAppId] = useState(apps[0]?.id ?? "");
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const appReviews = getReviewsForApp(selectedAppId);
  const selectedApp = apps.find((a) => a.id === selectedAppId);

  const appOptions = useMemo(
    () =>
      apps.map((app) => {
        const count = reviews.filter((r) => r.appId === app.id).length;
        return {
          id: app.id,
          name: app.name,
          subtitle:
            count > 0
              ? t("admin.reviewsCount", { count })
              : t("admin.noReviews"),
        };
      }),
    [reviews, t]
  );

  const handleRemove = async (reviewId: string) => {
    setError("");
    setRemovingId(reviewId);
    const result = await removeReview(reviewId, userEmail);
    setRemovingId(null);
    if (!result.ok) {
      setError(result.error ?? t("admin.reviewsDeleteError"));
    }
  };

  return (
    <section className="rounded-[32px] bg-phantom-surface border border-phantom-dark/5 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <MessageSquare className="h-6 w-6 text-phantom-purple" />
        <h2 className="text-xl font-semibold text-phantom-dark">{t("admin.reviewsTitle")}</h2>
      </div>
      <p className="text-sm text-phantom-gray mb-6">{t("admin.reviewsHint")}</p>

      <AdminAppSearchSelect
        apps={appOptions}
        value={selectedAppId}
        onChange={setSelectedAppId}
        label={t("admin.reviewsAppLabel")}
      />

      {!ready ? (
        <p className="text-sm text-phantom-gray mt-6">{t("common.loading")}</p>
      ) : appReviews.length === 0 ? (
        <p className="text-sm text-phantom-gray mt-6 rounded-[16px] bg-phantom-bg border border-phantom-dark/5 px-4 py-6 text-center">
          {t("admin.reviewsEmpty", { app: selectedApp?.name ?? "" })}
        </p>
      ) : (
        <div className="space-y-3 mt-6">
          {appReviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-4 rounded-[20px] bg-phantom-bg border border-phantom-dark/5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-phantom-dark">{review.userName}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-phantom-gray/70">{review.date}</span>
                </div>
                <p className="text-sm text-phantom-gray break-words">{review.comment}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                disabled={removingId === review.id}
                onClick={() => handleRemove(review.id)}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                {removingId === review.id ? t("admin.reviewsDeleting") : t("admin.reviewsDelete")}
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
    </section>
  );
}
