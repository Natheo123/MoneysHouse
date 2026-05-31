"use client";

import Link from "next/link";
import { useRef, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import { MoneyHouseLogo } from "@/components/icons/MoneyHouseLogo";
import { siteConfig } from "@/lib/config";
import { useTranslation } from "@/context/LanguageContext";

export function CtaSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from("[data-cta]", {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.to(logoRef.current, {
        y: -12,
        rotation: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-32 md:py-48 section-x overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <p data-cta className="text-phantom-gray text-base sm:text-lg mb-6 sm:mb-8">
          {t("home.ctaCommunity")}{" "}
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="text-phantom-purple hover:underline font-semibold"
          >
            Discord
          </a>
          . {t("home.ctaMore")}
        </p>
        <h2
          data-cta
          className="text-3xl sm:text-5xl md:text-7xl font-normal text-phantom-dark tracking-tight mb-4"
        >
          {t("home.ctaStart")}
        </h2>
        <h2
          data-cta
          className="text-3xl sm:text-5xl md:text-7xl font-normal text-phantom-dark tracking-tight mb-8 sm:mb-12 flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
        >
          {t("home.ctaJoin")}
          <span ref={logoRef} className="inline-block">
            <MoneyHouseLogo size={44} className="sm:hidden" />
            <MoneyHouseLogo size={56} className="hidden sm:block" />
          </span>
          {siteConfig.name}.
        </h2>
        <div data-cta>
          <Link href="/inscription">
            <Button
              size="lg"
              variant="secondary"
              className="border border-phantom-dark/10 hover:scale-[1.05] transition-transform duration-300"
            >
              {t("home.ctaFree")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
