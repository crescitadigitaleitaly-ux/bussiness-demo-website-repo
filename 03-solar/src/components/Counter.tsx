"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export function Counter({ value, suffix = "", locale }: { value: number; suffix?: string; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const fmt = new Intl.NumberFormat(locale, { useGrouping: "always" });
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = fmt.format(Math.round(v)) + suffix),
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix, locale]);

  // Final value is server-rendered so no-JS, crawlers and reduced-motion users see the real figure.
  // useGrouping "always": Node and browsers disagree on Italian 4-digit grouping (1200 vs 1.200), which breaks hydration.
  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat(locale, { useGrouping: "always" }).format(value) + suffix}
    </span>
  );
}
