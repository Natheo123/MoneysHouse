"use client";

import Link from "next/link";
import { useMemo, useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { SectionIcon, type SectionIconId } from "@/components/icons/UiIcons";
import { useApps } from "@/context/AppsContext";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

type StackConfig = {
  id: SectionIconId;
  title: string;
  subtitle: string;
  href: string;
  cards: { color: string; text: string; href: string; label: string }[];
};

function StackGroup({ stack }: { stack: StackConfig }) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    const wrapper = cardsRef.current;
    if (!section || !wrapper) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      wrapper.querySelectorAll("[data-stack-card]")
    );

    const ctx = gsap.context(() => {
      gsap.from(section.querySelector("[data-stack-title]"), {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });

      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          gsap.to(card, {
            scale: 0.88,
            opacity: 0.55,
            filter: "blur(2px)",
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top 75%",
              end: "top 28%",
              scrub: 0.8,
            },
          });
        }

        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div data-stack-title className="text-center mb-10 sm:mb-16 section-x">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-normal text-phantom-dark tracking-tight leading-tight flex items-center justify-center gap-2 sm:gap-3 flex-wrap px-2">
          {stack.title}{" "}
          <SectionIcon id={stack.id} size={36} className="align-middle" />{" "}
          {stack.subtitle} {t("home.stackAll")}
        </h2>
        <Link
          href={stack.href}
          className="inline-flex items-center gap-2 mt-6 text-phantom-purple hover:underline font-medium text-lg"
        >
          {t("home.seeMore")} <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div ref={cardsRef} className="relative section-x max-w-4xl mx-auto">
        {stack.cards.map((card, i) => (
          <div
            key={card.text}
            data-stack-card
            className="sticky top-24 sm:top-28 md:top-32 mb-4 sm:mb-6 last:mb-0"
            style={{ zIndex: i + 1 }}
          >
            <Link href={card.href} className="block group">
              <div
                className="rounded-[28px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 min-h-[220px] sm:min-h-[280px] md:min-h-[320px] flex flex-col justify-end shadow-xl transition-shadow duration-500 group-hover:shadow-2xl origin-top"
                style={{ backgroundColor: card.color }}
              >
                <span className="text-xs sm:text-sm font-semibold text-phantom-dark/60 uppercase tracking-wider mb-2 sm:mb-3">
                  {card.label}
                </span>
                <p className="text-xl sm:text-2xl md:text-3xl font-medium text-phantom-dark leading-snug max-w-xl">
                  {card.text}
                </p>
                <span className="inline-flex items-center gap-2 mt-6 text-phantom-dark/70 font-medium group-hover:gap-3 transition-all">
                  {t("apps.discover")} <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          </div>
        ))}
        <div className="h-[30vh]" aria-hidden />
      </div>
    </section>
  );
}

export function PhantomStackSection() {
  const { t } = useTranslation();
  const { getLocalizedApp } = useLanguage();
  const { getFeaturedApps } = useApps();

  const stacks = useMemo<StackConfig[]>(() => {
    const featured = getFeaturedApps().slice(0, 3).map(getLocalizedApp);

    return [
      {
        id: "passive",
        title: t("home.stackPassive"),
        subtitle: t("home.stackFor"),
        href: "/apps",
        cards: featured.map((app, i) => ({
          color: ["#AB9FF2", "#4878D8", "#E2DFFE"][i],
          text: app.shortDescription,
          href: `/apps/${app.slug}`,
          label: app.name,
        })),
      },
      {
        id: "easy",
        title: t("home.stackEasy"),
        subtitle: t("home.stackIn"),
        href: "/faq",
        cards: [
          { color: "#AB9FF2", text: t("home.stackInstall"), href: "/apps/earnapp", label: "EarnApp" },
          { color: "#4878D8", text: t("home.stackNoSkill"), href: "/faq", label: t("nav.faq") },
          { color: "#FFF3C4", text: t("home.stackTutorials"), href: "/apps", label: t("nav.apps") },
        ],
      },
      {
        id: "trusted",
        title: t("home.stackTrusted"),
        subtitle: t("home.stackBy"),
        href: "/classement",
        cards: [
          {
            color: "#E2DFFE",
            text: t("home.stackVerified"),
            href: "/classement",
            label: t("home.stackRanking"),
          },
          {
            color: "#AB9FF2",
            text: t("home.stackReviews"),
            href: "/apps",
            label: t("home.stackReviewsLabel"),
          },
          {
            color: "#4878D8",
            text: t("home.stackCompare"),
            href: "/comparateur",
            label: t("home.stackCompareLabel"),
          },
        ],
      },
    ];
  }, [t, getLocalizedApp, getFeaturedApps]);

  return (
    <div className="relative">
      {stacks.map((stack) => (
        <StackGroup key={stack.id} stack={stack} />
      ))}
    </div>
  );
}
