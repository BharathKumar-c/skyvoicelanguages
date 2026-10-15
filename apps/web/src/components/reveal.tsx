"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  role?: "region";
  tabIndex?: number;
};

export function Reveal({
  ariaLabel,
  children,
  className,
  delay = 0,
  role,
  tabIndex,
}: RevealProps) {
  return (
    <motion.div
      aria-label={ariaLabel}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      role={role}
      tabIndex={tabIndex}
      transition={{ duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.16 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
