"use client";

import Link from "next/link";
import { useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import { GsapAnimatedCounter } from "@/components/shared/GsapAnimatedCounter";

const heroLines = [
  "Gagne de l'argent avec",
  "les applications que tu",
  "utilises déjà.",
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(heroRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 1.2,
      })
        .from(
          "[data-hero-line]",
          { opacity: 0, y: 50, rotateX: 12, duration: 0.9, stagger: 0.12 },
          "-=0.6"
        )
        .from(
          "[data-hero-fade]",
          { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 },
          "-=0.5"
        );

      gsap.to(blob1Ref.current, {
        x: 40,
        y: -30,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(blob2Ref.current, {
        x: -50,
        y: 40,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(blob3Ref.current, {
        scale: 1.25,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(contentRef.current, {
        y: 120,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(heroRef.current, {
        scale: 0.92,
        borderRadius: "32px",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      [blob1Ref, blob2Ref, blob3Ref].forEach((ref, i) => {
        gsap.to(ref.current, {
          y: (i + 1) * 80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 section-x">
      <div className="max-w-7xl mx-auto">
        <div
          ref={heroRef}
          className="relative rounded-[24px] sm:rounded-[40px] bg-phantom-charcoal overflow-hidden min-h-[62vh] sm:min-h-[75vh] flex flex-col items-center justify-center text-center px-4 sm:px-8 py-12 sm:py-20 will-change-transform"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              ref={blob1Ref}
              className="absolute top-8 left-4 sm:top-16 sm:left-16 w-40 h-40 sm:w-72 sm:h-72 rounded-full bg-phantom-purple/40 blur-[80px]"
            />
            <div
              ref={blob2Ref}
              className="absolute bottom-8 right-4 sm:bottom-16 sm:right-16 w-48 h-48 sm:w-96 sm:h-96 rounded-full bg-phantom-blue/30 blur-[100px]"
            />
            <div
              ref={blob3Ref}
              className="absolute top-1/3 right-1/4 sm:right-1/3 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-[#8B7355]/30 blur-[60px]"
            />
          </div>

          <div ref={contentRef} className="relative z-10 max-w-4xl">
            <p data-hero-fade className="text-phantom-cream/70 text-lg mb-8">
              La plateforme de revenus passifs
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal text-phantom-cream leading-[1.08] tracking-[-0.02em] mb-8 perspective-[1000px]">
              {heroLines.map((line) => (
                <span
                  key={line}
                  data-hero-line
                  className="block overflow-hidden"
                >
                  {line}
                </span>
              ))}
            </h1>

            <p
              data-hero-fade
              className="text-phantom-cream/55 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            >
              Découvre les meilleures applications de revenus passifs testées et approuvées.
            </p>

            <div data-hero-fade className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/inscription">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto hover:scale-[1.03] transition-transform">
                  Commencer
                </Button>
              </Link>
              <Link href="/apps">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-phantom-cream/25 text-phantom-cream hover:bg-phantom-cream/10 hover:scale-[1.03] transition-transform"
                >
                  Voir les applications
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div
            data-hero-fade
            className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-phantom-cream/10 w-full max-w-2xl"
          >
            {[
              { value: 5, suffix: "+", label: "Applications testées" },
              { value: 50, suffix: "€", label: "Revenus max/mois" },
              { value: 5, suffix: "", label: "Apps disponibles" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-phantom-cream">
                  <GsapAnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs sm:text-sm text-phantom-cream/45 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
