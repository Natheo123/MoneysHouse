"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsapPlugins();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
