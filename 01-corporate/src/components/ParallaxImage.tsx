"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

type Props = { src: string; alt: string; sizes: string; priority?: boolean; strength?: number; className?: string };

/** Image that drifts slightly slower than the page. MotionConfig reducedMotion="user" disables the transform. */
export function ParallaxImage({ src, alt, sizes, priority, strength = 8, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={`overflow-hidden ${/\babsolute\b/.test(className) ? "" : "relative"} ${className}`}>
      <motion.div style={{ y }} className="absolute inset-[-10%_0]">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </div>
  );
}
