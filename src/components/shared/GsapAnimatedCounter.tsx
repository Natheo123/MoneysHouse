"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";

interface GsapAnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function GsapAnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: GsapAnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    registerGsapPlugins();
    const el = ref.current;
    if (!el) return;

    const obj = { value: 0 };

    const tween = gsap.to(obj, {
      value: end,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        el.textContent = `${prefix}${Math.floor(obj.value).toLocaleString("fr-FR")}${suffix}`;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [end, suffix, prefix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

/** @deprecated Use GsapAnimatedCounter */
export const AnimatedCounter = GsapAnimatedCounter;
