"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

export function Reveal({ delay = 0, y = 28, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Staggers direct <RevealItem> children as the group scrolls into view. */
type Tag = "div" | "ol" | "ul" | "li";

export function RevealGroup({ children, stagger = 0.08, as = "div", ...rest }: HTMLMotionProps<"div"> & { stagger?: number; as?: Tag }) {
  const C = motion[as] as typeof motion.div;
  return (
    <C
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </C>
  );
}

export function RevealItem({ children, as = "div", ...rest }: HTMLMotionProps<"div"> & { as?: Tag }) {
  const C = motion[as] as typeof motion.div;
  return (
    <C
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
      }}
      {...rest}
    >
      {children}
    </C>
  );
}
