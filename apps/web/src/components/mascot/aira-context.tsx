"use client";

/**
 * Aira Mascot — Contextual Wrapper
 *
 * Pre-configured mascot instances for common UI contexts.
 * Each wrapper maps a page section to the appropriate pose,
 * size, and animation behavior.
 */

import { AiraMascot } from "./aira-mascot";
import type { AiraMascotProps, AiraPose } from "./types";

/* ------------------------------------------------------------------ */
/*  Context presets                                                    */
/* ------------------------------------------------------------------ */

type ContextPreset = Pick<
  AiraMascotProps,
  "pose" | "size" | "idle" | "sparkPulse" | "aria-label"
>;

const CONTEXT_PRESETS: Record<string, ContextPreset> = {
  hero: {
    pose: "front",
    size: "xl",
    idle: "float",
    sparkPulse: true,
    "aria-label": "Aira welcomes you to SkyVoice IELTS coaching",
  },
  "hero-speaking": {
    pose: "speaking",
    size: "xl",
    idle: "float",
    sparkPulse: true,
    "aria-label": "Aira explains how SkyVoice coaching works",
  },
  method: {
    pose: "three-quarter",
    size: "lg",
    idle: "breathe",
    sparkPulse: true,
    "aria-label": "Aira guides you through the SkyVoice method",
  },
  listening: {
    pose: "listening",
    size: "md",
    idle: "breathe",
    sparkPulse: false,
    "aria-label": "Aira demonstrates listening practice",
  },
  speaking: {
    pose: "speaking",
    size: "md",
    idle: "breathe",
    sparkPulse: true,
    "aria-label": "Aira demonstrates speaking practice",
  },
  reading: {
    pose: "reading",
    size: "md",
    idle: "breathe",
    sparkPulse: false,
    "aria-label": "Aira demonstrates reading practice",
  },
  writing: {
    pose: "writing",
    size: "md",
    idle: "breathe",
    sparkPulse: false,
    "aria-label": "Aira demonstrates writing practice",
  },
  feedback: {
    pose: "feedback",
    size: "lg",
    idle: "float",
    sparkPulse: true,
    "aria-label": "Aira shows your personalized feedback",
  },
  celebration: {
    pose: "celebration",
    size: "lg",
    idle: "none",
    sparkPulse: true,
    "aria-label": "Aira celebrates your achievement!",
  },
  "thank-you": {
    pose: "celebration",
    size: "xl",
    idle: "float",
    sparkPulse: true,
    "aria-label": "Aira celebrates your assessment booking!",
  },
  loading: {
    pose: "front",
    size: "sm",
    idle: "float",
    sparkPulse: true,
    "aria-label": "Loading…",
  },
  "nav-accent": {
    pose: "front",
    size: "xs",
    idle: "none",
    sparkPulse: false,
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Context component                                                 */
/* ------------------------------------------------------------------ */

interface AiraContextProps extends Omit<AiraMascotProps, "pose"> {
  /** Named context preset. */
  context: keyof typeof CONTEXT_PRESETS;
  /** Override the preset pose if needed. */
  pose?: AiraPose;
}

/**
 * Context-aware Aira wrapper. Uses presets for consistent
 * sizing and behavior across the website.
 *
 * @example
 * ```tsx
 * <AiraContext context="hero" />
 * <AiraContext context="listening" />
 * <AiraContext context="thank-you" />
 * ```
 */
export function AiraContext({ context, ...overrides }: AiraContextProps) {
  const preset = CONTEXT_PRESETS[context];
  if (!preset) {
    console.warn(`[AiraMascot] Unknown context "${context}", falling back to hero.`);
    return <AiraMascot {...CONTEXT_PRESETS.hero} {...overrides} />;
  }
  return <AiraMascot {...preset} {...overrides} />;
}

/* ------------------------------------------------------------------ */
/*  IELTS module mapper                                               */
/* ------------------------------------------------------------------ */

/** Maps IELTS module names to the corresponding mascot pose. */
const MODULE_POSE_MAP: Record<string, AiraPose> = {
  listening: "listening",
  reading: "reading",
  writing: "writing",
  speaking: "speaking",
};

interface AiraModuleProps extends Omit<AiraMascotProps, "pose"> {
  /** IELTS module name. */
  module: "listening" | "reading" | "writing" | "speaking";
}

/**
 * Renders Aira in the pose matching a specific IELTS module.
 *
 * @example
 * ```tsx
 * <AiraModule module="listening" size="md" />
 * ```
 */
export function AiraModule({ module, ...props }: AiraModuleProps) {
  const pose = MODULE_POSE_MAP[module] ?? "front";
  return (
    <AiraMascot
      pose={pose}
      aria-label={`Aira demonstrates ${module} practice`}
      {...props}
    />
  );
}
