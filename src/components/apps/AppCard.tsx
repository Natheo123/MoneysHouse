"use client";

import Link from "next/link";
import { useRef, useLayoutEffect } from "react";
import { Star, Heart, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import type { App } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEarnings } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { AppLogo } from "@/components/icons/AppLogo";
import { useAppReviews } from "@/hooks/useAppReviews";

const platformLabels: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  windows: "Windows",
  linux: "Linux",
  web: "Web",
};

interface AppCardProps {
  app: App;
  showFavorite?: boolean;
}

export function AppCard({ app, showFavorite = true }: AppCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useUser();
  const { stats } = useAppReviews(app.id);
  const favorite = isFavorite(app.id);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const enter = () =>
      gsap.to(el, { y: -6, duration: 0.3, ease: "power2.out" });
    const leave = () =>
      gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={cardRef}>
      <Card className="overflow-hidden h-full flex flex-col group">
        <CardContent className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-14 h-14 rounded-[20px] flex items-center justify-center"
              style={{ backgroundColor: `${app.color}40` }}
            >
              <AppLogo appId={app.id} size={36} />
            </div>
            {showFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(app.id);
                }}
                className="p-2 rounded-full hover:bg-phantom-lavender/50 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${favorite ? "fill-phantom-purple text-phantom-purple" : "text-phantom-gray"}`}
                />
              </button>
            )}
          </div>
          <h3 className="text-xl font-semibold text-phantom-dark mb-2">{app.name}</h3>
          <p className="text-phantom-gray text-sm mb-4 flex-1">{app.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">
              {app.earningsLabel || formatEarnings(app.earningsMin, app.earningsMax)}
            </Badge>
            <Badge variant="outline">{app.difficultyLabel}</Badge>
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {app.platforms.map((p) => (
              <span key={p} className="text-xs text-phantom-gray bg-phantom-bg px-2 py-1 rounded-full">
                {platformLabels[p]}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            {stats.count > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-phantom-dark">{stats.average}</span>
                <span className="text-xs text-phantom-gray">({stats.count} avis)</span>
              </div>
            ) : (
              <span className="text-xs text-phantom-gray">Pas encore d&apos;avis</span>
            )}
            <Link href={`/apps/${app.slug}`}>
              <Button size="sm" variant="default">
                Découvrir
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
