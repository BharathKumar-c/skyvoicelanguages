"use client";

/**
 * Aira Mascot — Ground shadow
 *
 * Soft floor shadow that breathes in phase with AiraMascot's float idle
 * (2.6 s): it narrows and fades while Aira rises. Purely decorative.
 */

import { motion, useReducedMotion } from "motion/react";

interface AiraGroundShadowProps {
  /** Rendered width in px. The asset is 240×48. */
  width?: number;
  /** Use the light variant on navy backgrounds. */
  tone?: "dark" | "light";
  className?: string;
}

export function AiraGroundShadow({
  width = 200,
  tone = "dark",
  className,
}: AiraGroundShadowProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.img
      alt=""
      aria-hidden="true"
      className={`aira-ground-shadow aira-ground-shadow-${tone} ${className ?? ""}`}
      height={(width * 48) / 240}
      src="/assets/generated/mascots/aira-ground-shadow.svg"
      width={width}
      animate={
        prefersReducedMotion
          ? undefined
          : { scaleX: [1, 0.86, 1], opacity: [1, 0.65, 1] }
      }
      transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
    />
  );
}
