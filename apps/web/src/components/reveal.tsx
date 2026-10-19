"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { fadeFirstTransition, usePrefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  role?: "region";
  tabIndex?: number;
};

/**
 * Scroll-in entrance: fade up 24px. With reduced motion it is the same fade
 * (same duration, delay and easing) without the upward travel.
 */
export function Reveal({
  ariaLabel,
  children,
  className,
  delay = 0,
  role,
  tabIndex,
}: RevealProps) {
  const reduce = usePrefersReducedMotion();

  return (
    <motion.div
      aria-label={ariaLabel}
      className={className}
      data-reveal=""
      initial={{ opacity: 0, y: 24 }}
      role={role}
      tabIndex={tabIndex}
      transition={fadeFirstTransition(reduce, { delay, duration: 0.48 }, ["y"])}
      viewport={{ once: true, amount: 0.16 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
