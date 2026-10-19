"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type DrawLineProps = {
  className: string;
  delay?: number;
  duration?: number;
};

/**
 * Decorative connector that "draws" in once its section scrolls into view.
 * Clipping from the top-left reveals horizontal lines left→right and vertical
 * lines top→bottom, so the same component works for both responsive layouts.
 *
 * The parent is observed rather than the line: a fully clipped element never
 * reports as intersecting, so it could not trigger its own reveal.
 */
export function DrawLine({ className, delay = 0.2, duration = 0.9 }: DrawLineProps) {
  const prefersReducedMotion = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLElement | null>(null);

  // Must run before useInView's own effect, which reads parentRef.current.
  useEffect(() => {
    parentRef.current = lineRef.current?.parentElement ?? null;
  }, []);

  const inView = useInView(parentRef, { once: true, amount: 0.5 });

  return (
    <motion.div
      animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
      aria-hidden="true"
      className={className}
      initial={{ clipPath: "inset(0% 100% 100% 0%)" }}
      ref={lineRef}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  );
}
