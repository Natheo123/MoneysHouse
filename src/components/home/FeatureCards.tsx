"use client";

import Link from "next/link";
import { useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { GsapScrollReveal } from "@/components/shared/GsapScrollReveal";
import { getFeaturedApps } from "@/lib/data/apps";
import { AppCard } from "@/components/apps/AppCard";

const features = [
  {
    title: "Revenus passifs",
    subtitle: "pour",
    emoji: "💰",
    color: "bg-phantom-purple",
    items: getFeaturedApps().slice(0, 3).map((app) => ({
      text: app.shortDescription,
      href: `/apps/${app.slug}`,
    })),
    href: "/apps",
  },
  {
    title: "Facile à démarrer",
    subtitle: "en",
    emoji: "⚡",
    color: "bg-phantom-blue",
    items: [
      { text: "Installation en 2 minutes chrono.", href: "/apps/earnapp" },
      { text: "Aucune compétence technique requise.", href: "/faq" },
      { text: "Tutoriels pas à pas pour chaque app.", href: "/apps" },
    ],
    href: "/faq",
  },
  {
    title: "Testé et approuvé",
    subtitle: "par",
    emoji: "✅",
    color: "bg-[#FFF3C4]",
    items: [
      { text: "Chaque app est vérifiée par notre équipe.", href: "/classement" },
      { text: "Avis authentiques de la communauté.", href: "/apps" },
      { text: "Comparateur pour choisir la meilleure.", href: "/comparateur" },
    ],
    href: "/classement",
  },
];

function FeatureCard({
  text,
  href,
  color,
}: {
  text: string;
  href: string;
  color: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const enter = () =>
      gsap.to(el, { y: -8, scale: 1.02, duration: 0.3, ease: "power2.out" });
    const leave = () =>
      gsap.to(el, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <Link ref={ref} href={href}>
      <div
        className={`${color} rounded-[32px] p-8 min-h-[200px] flex items-end transition-shadow hover:shadow-xl`}
      >
        <p className="text-lg md:text-xl text-phantom-dark font-medium leading-snug">
          {text}
        </p>
      </div>
    </Link>
  );
}

export function FeatureCards() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        {features.map((feature, i) => (
          <GsapScrollReveal key={feature.title} delay={i * 0.1}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-normal text-phantom-dark tracking-tight">
                {feature.title}{" "}
                <span className="inline-block">{feature.emoji}</span>{" "}
                {feature.subtitle} tous
              </h2>
              <Link
                href={feature.href}
                className="inline-flex items-center gap-2 mt-4 text-phantom-purple hover:underline font-medium"
              >
                Voir plus <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {feature.items.map((item) => (
                <FeatureCard
                  key={item.text}
                  text={item.text}
                  href={item.href}
                  color={feature.color}
                />
              ))}
            </div>
          </GsapScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function FeaturedApps() {
  const featured = getFeaturedApps();

  return (
    <section className="py-20 px-6 bg-phantom-surface">
      <div className="max-w-7xl mx-auto">
        <GsapScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-normal text-phantom-dark tracking-tight mb-4">
              Applications populaires
            </h2>
            <p className="text-phantom-gray text-lg">
              Les meilleures apps pour commencer à gagner dès aujourd&apos;hui
            </p>
          </div>
        </GsapScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((app, i) => (
            <GsapScrollReveal key={app.id} delay={i * 0.1}>
              <AppCard app={app} />
            </GsapScrollReveal>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/apps">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-[32px] border border-phantom-dark/20 text-phantom-dark hover:bg-phantom-lavender/50 transition-all font-medium">
              Voir toutes les applications
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
