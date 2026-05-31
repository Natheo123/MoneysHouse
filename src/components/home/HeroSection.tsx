"use client";

import Link from "next/link";
import { useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import { GsapAnimatedCounter } from "@/components/shared/GsapAnimatedCounter";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from("[data-hero-item]", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.to(blob1Ref.current, {
        x: 30,
        y: -20,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(blob2Ref.current, {
        x: -40,
        y: 30,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(blob3Ref.current, {
        scale: 1.2,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          ref={heroRef}
          className="relative rounded-[40px] bg-phantom-dark overflow-hidden min-h-[70vh] flex flex-col items-center justify-center text-center px-8 py-20"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              ref={blob1Ref}
              className="absolute top-20 left-20 w-64 h-64 rounded-full bg-phantom-purple/30 blur-3xl"
            />
            <div
              ref={blob2Ref}
              className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-phantom-blue/20 blur-3xl"
            />
            <div
              ref={blob3Ref}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-phantom-lavender/10 blur-3xl"
            />
          </div>

          <div className="relative z-10 max-w-4xl">
            <p data-hero-item className="text-phantom-cream/70 text-lg mb-6">
              La plateforme de revenus passifs
            </p>
            <h1
              data-hero-item
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-phantom-cream leading-[1.1] tracking-tight mb-8"
            >
              Gagne de l&apos;argent avec les applications que tu utilises déjà.
            </h1>
            <p data-hero-item className="text-phantom-cream/60 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Découvre les meilleures applications de revenus passifs testées et approuvées.
            </p>
            <div data-hero-item className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/inscription">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Commencer
                </Button>
              </Link>
              <Link href="/apps">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-phantom-cream/30 text-phantom-cream hover:bg-phantom-cream/10"
                >
                  Voir les applications
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div
            data-hero-item
            className="relative z-10 grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-phantom-cream/10 w-full max-w-2xl"
          >
            {[
              { value: 5, suffix: "+", label: "Applications testées" },
              { value: 50, suffix: "€", label: "Revenus max/mois" },
              { value: 5, suffix: "", label: "Apps disponibles" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-semibold text-phantom-cream">
                  <GsapAnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-phantom-cream/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
