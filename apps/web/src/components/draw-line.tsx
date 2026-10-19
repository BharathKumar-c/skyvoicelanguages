"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";

import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";

type DrawLineProps = {
  className: string;
  delay?: number;
  duration?: number;
};

/**
 * Decorative connector that "draws" in once its section scrolls into view.
 * Clipping from the top-left reveals horizontal lines left→right and vertical
 * lines top→bottom, so the same component works for both responsive layouts.
 * With reduced motion the line fades in whole instead of drawing.
 *
 * The parent is observed rather than the line: a fully clipped element never
 * reports as intersecting, so it could not trigger its own reveal.
 */
export function DrawLine({ className, delay = 0.2, duration = 0.9 }: DrawLineProps) {
  const reduce = usePrefersReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLElement | null>(null);

  // Must run before useInView's own effect, which reads parentRef.current.
  useEffect(() => {
    parentRef.current = lineRef.current?.parentElement ?? null;
  }, []);

  const inView = useInView(parentRef, { once: true, amount: 0.5 });
  const shown = { clipPath: "inset(0% 0% 0% 0%)" };

  return (
    <motion.div
      // Reduced motion: unclip instantly and fade from 0, so nothing travels.
      animate={inView ? (reduce ? { ...shown, opacity: [0, 1] } : shown) : undefined}
      aria-hidden="true"
      className={className}
      initial={{ clipPath: "inset(0% 100% 100% 0%)" }}
      ref={lineRef}
      transition={
        reduce
          ? { clipPath: { duration: 0 }, opacity: { delay, duration: 0.5, ease: EASE_OUT } }
          : { delay, duration, ease: EASE_OUT }
      }
    />
  );
}
