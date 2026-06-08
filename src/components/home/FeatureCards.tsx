"use client";

import Link from "next/link";
import { useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { AppCard } from "@/components/apps/AppCard";
import { useApps } from "@/context/AppsContext";
import { useTranslation } from "@/context/LanguageContext";

export function FeaturedApps() {
  const { t } = useTranslation();
  const { getFeaturedApps } = useApps();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const featured = getFeaturedApps();

  useLayoutEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from("[data-featured-title]", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      const cards = gridRef.current?.querySelectorAll("[data-app-card]");
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          y: 70,
          scale: 0.94,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 md:py-32 section-x bg-phantom-surface">
      <div className="max-w-7xl mx-auto">
        <div data-featured-title className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4">
            {t("home.featuredTitle")}
          </h2>
          <p className="text-phantom-gray text-lg">
            {t("home.featuredSubtitle")}
          </p>
        </div>
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((app) => (
            <div key={app.id} data-app-card>
              <AppCard app={app} />
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link href="/apps">
            <button className="inline-flex items-center gap-2 px-10 py-5 rounded-[32px] border border-phantom-dark/15 text-phantom-dark hover:bg-phantom-lavender/50 hover:scale-[1.03] transition-all duration-300 font-medium">
              {t("home.viewAllApps")}
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
