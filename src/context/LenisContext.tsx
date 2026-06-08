"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

function shouldUseSmoothScroll() {
  if (typeof window === "undefined") return false;

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowViewport = window.matchMedia("(max-width: 1023px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return !coarsePointer && !narrowViewport && !reducedMotion;
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    registerGsapPlugins();

    let instance: Lenis | null = null;
    let frame = 0;

    const start = () => {
      if (instance || !shouldUseSmoothScroll()) return;

      instance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      instance.on("scroll", ScrollTrigger.update);
      setLenis(instance);

      const raf = (time: number) => {
        instance?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      ScrollTrigger.refresh();
    };

    const stop = () => {
      if (!instance) return;
      cancelAnimationFrame(frame);
      instance.destroy();
      instance = null;
      setLenis(null);
      ScrollTrigger.refresh();
    };

    const sync = () => {
      if (shouldUseSmoothScroll()) start();
      else stop();
    };

    sync();

    const queries = [
      window.matchMedia("(max-width: 1023px)"),
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];

    const onMediaChange = () => sync();
    queries.forEach((query) => query.addEventListener("change", onMediaChange));

    return () => {
      queries.forEach((query) => query.removeEventListener("change", onMediaChange));
      stop();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
