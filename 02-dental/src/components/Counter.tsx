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
    const fmt = new Intl.NumberFormat(locale);
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = fmt.format(Math.round(v)) + suffix),
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix, locale]);

  // Final value is server-rendered so no-JS, crawlers and reduced-motion users see the real figure.
  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat(locale).format(value) + suffix}
    </span>
  );
}
