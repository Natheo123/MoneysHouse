"use client";

import Link from "next/link";
import { useRef, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import { GsapAnimatedCounter } from "@/components/shared/GsapAnimatedCounter";
import { MoneyHouseLogo } from "@/components/icons/MoneyHouseLogo";
import { siteConfig } from "@/lib/config";

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from("[data-cta]", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p data-cta className="text-phantom-gray text-lg mb-6">
          Rejoins la communauté sur{" "}
          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="text-phantom-purple hover:underline font-semibold"
          >
            Discord
          </a>
          . C&apos;est plus qu&apos;une plateforme.
        </p>
        <h2
          data-cta
          className="text-5xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-4"
        >
          Commence maintenant.
        </h2>
        <h2
          data-cta
          className="text-5xl md:text-6xl font-normal text-phantom-dark tracking-tight mb-10 flex items-center justify-center gap-3 flex-wrap"
        >
          Rejoins
          <MoneyHouseLogo size={48} className="inline-block align-middle" />
          {siteConfig.name}.
        </h2>
        <div data-cta>
          <Link href="/inscription">
            <Button size="lg" variant="secondary" className="border border-phantom-dark/10">
              Commencer gratuitement
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
