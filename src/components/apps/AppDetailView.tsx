"use client";

import { useEffect, useRef, useLayoutEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  Heart,
  Check,
  X,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import type { App } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { PageShell } from "@/components/layout/PageShell";
import { useUser } from "@/context/UserContext";
import { useAdmin } from "@/context/AdminContext";
import { AppLogo } from "@/components/icons/AppLogo";
import { AppDownloadLinks } from "@/components/apps/AppDownloadLinks";
import { AppProofsGallery } from "@/components/apps/AppProofsGallery";
import { useProofs } from "@/context/ProofContext";
import { useAppReviews } from "@/hooks/useAppReviews";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

const platformLabels: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  windows: "Windows",
  linux: "Linux",
  web: "Web",
};

export function AppDetailView({ app }: { app: App }) {
  const { t } = useTranslation();
  const { getLocalizedApp, formatEarnings } = useLanguage();
  const localizedApp = getLocalizedApp(app);
  const { isFavorite, toggleFavorite, addToHistory, user } = useUser();
  const { isAdmin } = useAdmin();
  const { reviews, stats, alreadyReviewed, submitReview, removeReview } = useAppReviews(
    localizedApp.id,
    user?.id
  );
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [removingReviewId, setRemovingReviewId] = useState<string | null>(null);
  const { ready: proofsReady, getProofCount } = useProofs();
  const hasProofs = proofsReady && getProofCount(localizedApp.id) > 0;

  useEffect(() => {
    addToHistory(localizedApp.id);
  }, [localizedApp.id, addToHistory]);

  const handleSubmitReview = async () => {
    if (!user || !newComment.trim()) return;
    setSubmitError("");
    const result = await submitReview({
      userId: user.id,
      userName: user.name,
      rating: newRating,
      comment: newComment.trim(),
    });
    if (result.ok) {
      setNewComment("");
    } else {
      setSubmitError(t("appDetail.reviewDuplicate"));
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user?.email) return;
    setRemovingReviewId(reviewId);
    await removeReview(reviewId, user.email);
    setRemovingReviewId(null);
  };

  const showAdminReviewActions = Boolean(user?.email && isAdmin(user.email));

  return (
    <PageShell maxWidth="4xl">
        <GsapScrollReveal>
          <div className="rounded-[24px] sm:rounded-[40px] bg-phantom-dark p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 relative overflow-hidden">
            <div className="absolute inset-0">
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: app.color }}
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-20 h-20 rounded-[24px] flex items-center justify-center"
                style={{ backgroundColor: `${localizedApp.color}60` }}
              >
                  <AppLogo appId={localizedApp.id} size={52} />
                </div>
                <button
                  onClick={() => toggleFavorite(localizedApp.id)}
                  className="p-3 rounded-full bg-phantom-cream/10 hover:bg-phantom-cream/20 transition-colors"
                >
                  <Heart
                    className={`h-6 w-6 ${isFavorite(localizedApp.id) ? "fill-phantom-purple text-phantom-purple" : "text-phantom-cream"}`}
                  />
                </button>
              </div>
              <h1 className="text-4xl md:text-5xl font-normal text-phantom-cream tracking-tight mb-4">
                {localizedApp.name}
              </h1>
              <p className="text-phantom-cream/70 text-lg mb-6">{localizedApp.description}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-phantom-purple/30 text-phantom-cream border-0">
                  {localizedApp.earningsLabel || formatEarnings(localizedApp.earningsMin, localizedApp.earningsMax)}
                </Badge>
                <Badge className="bg-phantom-cream/10 text-phantom-cream border-0">
                  {localizedApp.difficultyLabel}
                </Badge>
                {stats.count > 0 && (
                  <div className="flex items-center gap-1 text-phantom-cream">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{stats.average}</span>
                    <span className="text-phantom-cream/50">
                      ({stats.count} {t("appDetail.communityReviews")})
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {localizedApp.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-sm text-phantom-cream/70 bg-phantom-cream/10 px-3 py-1 rounded-full"
                  >
                    {platformLabels[p]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GsapScrollReveal>

        <div className="space-y-12">
          <GsapScrollReveal>
            <AppDownloadLinks app={localizedApp} />
          </GsapScrollReveal>

          {hasProofs && (
            <GsapScrollReveal>
              <AppProofsGallery app={localizedApp} />
            </GsapScrollReveal>
          )}

          {localizedApp.hasReferral !== false && (
            <GsapScrollReveal>
              <section className="rounded-[24px] bg-phantom-bg border border-phantom-purple/20 p-6">
                <h2 className="text-lg font-semibold text-phantom-dark mb-3">
                  {t("appDetail.referralHow", { app: localizedApp.name })}
                </h2>
                <p className="text-phantom-gray text-sm leading-relaxed whitespace-pre-line">
                  {localizedApp.referralInstructions}
                </p>
              </section>
            </GsapScrollReveal>
          )}

          <GsapScrollReveal>
            <section>
              <h2 className="text-2xl font-semibold text-phantom-dark mb-4">{t("appDetail.howItWorks")}</h2>
              <p className="text-phantom-gray leading-relaxed">{localizedApp.howItWorks}</p>
            </section>
          </GsapScrollReveal>

          <GsapScrollReveal>
            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <h2 className="text-2xl font-semibold text-phantom-dark mb-4">{t("appDetail.advantages")}</h2>
                <ul className="space-y-3">
                  {localizedApp.advantages.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-phantom-gray">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold text-phantom-dark mb-4">{t("appDetail.disadvantages")}</h2>
                <ul className="space-y-3">
                  {localizedApp.disadvantages.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-phantom-gray">
                      <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </GsapScrollReveal>

          <GsapScrollReveal>
            <section>
              <h2 className="text-2xl font-semibold text-phantom-dark mb-6">
                {t("appDetail.tutorial")}
              </h2>
              <div className="space-y-4">
                {localizedApp.tutorial.map((step) => (
                  <TutorialStep key={step.step} step={step.step} title={step.title} description={step.description} />
                ))}
              </div>
            </section>
          </GsapScrollReveal>

          {localizedApp.faq.length > 0 && (
            <GsapScrollReveal>
              <section>
                <h2 className="text-2xl font-semibold text-phantom-dark mb-4">{t("appDetail.faq")}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {localizedApp.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </GsapScrollReveal>
          )}

          <GsapScrollReveal>
            <section>
              <h2 className="text-2xl font-semibold text-phantom-dark mb-2">{t("appDetail.reviewsTitle")}</h2>
              <p className="text-phantom-gray text-sm mb-6">{t("appDetail.reviewsHint")}</p>

              {!user && (
                <div className="mb-8 p-6 rounded-[24px] bg-phantom-surface border border-phantom-dark/5 text-center">
                  <p className="text-phantom-gray mb-4">
                    {t("appDetail.loginToReview", { app: localizedApp.name })}
                  </p>
                  <Link href="/connexion">
                    <Button>{t("appDetail.loginBtn")}</Button>
                  </Link>
                </div>
              )}

              {user && !alreadyReviewed && (
                <div className="mb-8 p-6 rounded-[24px] bg-phantom-surface border border-phantom-dark/5">
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setNewRating(n)}>
                        <Star
                          className={`h-6 w-6 ${n <= newRating ? "fill-yellow-400 text-yellow-400" : "text-phantom-gray"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t("appDetail.reviewPlaceholder")}
                    className="w-full p-4 rounded-[16px] border border-phantom-dark/10 bg-phantom-bg text-phantom-dark resize-none h-24 mb-3 focus:outline-none focus:ring-2 focus:ring-phantom-purple"
                  />
                  {submitError && (
                    <p className="text-red-500 text-sm mb-3">{submitError}</p>
                  )}
                  <Button onClick={handleSubmitReview} disabled={!newComment.trim()}>
                    {t("appDetail.publishReview")}
                  </Button>
                </div>
              )}

              {user && alreadyReviewed && (
                <p className="text-sm text-phantom-gray mb-6">{t("appDetail.alreadyReviewed")}</p>
              )}

              {reviews.length === 0 ? (
                <div className="text-center py-12 rounded-[24px] bg-phantom-surface border border-phantom-dark/5">
                  <p className="text-phantom-gray">{t("appDetail.noReviewsYet")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 rounded-[24px] bg-phantom-surface border border-phantom-dark/5"
                    >
                      <div className="flex items-center justify-between mb-2 gap-3">
                        <span className="font-medium text-phantom-dark">{review.userName}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, j) => (
                              <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          {showAdminReviewActions && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(review.id)}
                              disabled={removingReviewId === review.id}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                              title={t("appDetail.deleteReview")}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {t("appDetail.deleteReview")}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-phantom-gray text-sm mb-1">{review.comment}</p>
                      <p className="text-xs text-phantom-gray/60">{review.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </GsapScrollReveal>

          <div className="text-center pt-8">
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 text-phantom-purple hover:underline font-medium"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              {t("appDetail.backToApps")}
            </Link>
          </div>
        </div>
    </PageShell>
  );
}

function TutorialStep({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = () => gsap.to(el, { x: 4, duration: 0.25, ease: "power2.out" });
    const leave = () => gsap.to(el, { x: 0, duration: 0.25, ease: "power2.out" });
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-start gap-4 p-6 rounded-[24px] bg-phantom-surface border border-phantom-dark/5"
    >
      <div className="w-10 h-10 rounded-full bg-phantom-purple flex items-center justify-center text-phantom-dark font-semibold shrink-0">
        {step}
      </div>
      <div>
        <h3 className="font-semibold text-phantom-dark mb-1">{title}</h3>
        <p className="text-phantom-gray text-sm">{description}</p>
      </div>
    </div>
  );
}
