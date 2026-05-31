"use client";

import { useRef, useLayoutEffect, ReactNode } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";

interface GsapScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scale?: number;
}

export function GsapScrollReveal({
  children,
  className,
  delay = 0,
  y = 60,
  scale = 0.96,
}: GsapScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y, scale });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, scale]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export const ScrollReveal = GsapScrollReveal;
