"use client";

/**
 * Aira Mascot — Main Component
 *
 * Production-ready React component for the SkyVoice Signal Navigator.
 * Features:
 *  - Sprite-based canonical poses (8 states)
 *  - Smooth spring-based pose transitions
 *  - Idle floating animation with configurable variants
 *  - Spark pulse animation
 *  - Responsive sizing with named presets
 *  - Full accessibility support (reduced-motion, ARIA)
 *  - Modular architecture for future AI voice integration
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { AiraSprite } from "./aira-sprite";
import type {
  AiraMascotProps,
  AiraPose,
  AnimationState,
  CanonicalPose,
  IdleAnimation,
  TransitionEffect,
} from "./types";
import { CANONICAL_POSE_CELLS, SPARK_ANCHORS, SPRITE_SHEET, resolveSize } from "./types";

import styles from "./aira-mascot.module.css";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const CANONICAL_POSES = new Set(Object.keys(CANONICAL_POSE_CELLS));

function isCanonicalPose(pose: AiraPose): pose is CanonicalPose {
  return CANONICAL_POSES.has(pose);
}

/** Map a transition name to Motion spring/tween config. */
function transitionConfig(effect: TransitionEffect, reduceMotion = false) {
  if (reduceMotion) return { duration: 0 };
  switch (effect) {
    case "spring":
      return { type: "spring" as const, stiffness: 200, damping: 22, mass: 1 };
    case "ease":
      return { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };
    case "snap":
      return { duration: 0.15, ease: "easeOut" as const };
    case "none":
      return { duration: 0 };
  }
}

/** Idle animation keyframes for floating bob. */
const FLOAT_KEYFRAMES = {
  y: [0, -5, 0],
  transition: {
    duration: 2.6,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
  },
};

/** Idle animation keyframes for subtle breathing. */
const BREATHE_KEYFRAMES = {
  scale: [1, 1.015, 1],
  transition: {
    duration: 3.2,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
  },
};

/** The glow asset is 64 px wide around a 34 px spark. */
const SPARK_GLOW_SCALE = 64 / 34;

/** Spark pulse animation. */
const SPARK_PULSE = {
  opacity: [0.85, 0.3, 0.85],
  scale: [1, 1.2, 1],
  transition: {
    duration: 1.9,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
  },
};

/* ------------------------------------------------------------------ */
/*  Default accessible label                                          */
/* ------------------------------------------------------------------ */

const POSE_LABELS: Record<string, string> = {
  front: "Aira, the SkyVoice learning guide, facing forward",
  "three-quarter": "Aira turned at a three-quarter angle, looking attentive",
  listening: "Aira listening carefully with hand near ear",
  speaking: "Aira speaking with expressive hand gestures",
  reading: "Aira reading a page with focus",
  writing: "Aira writing on a surface with concentration",
  feedback: "Aira holding a progress card with encouraging expression",
  celebration: "Aira celebrating with raised fists and joyful expression",
  thinking: "Aira in a thoughtful pose with hand on chin",
  waving: "Aira waving hello in a friendly greeting",
  surprised: "Aira with a surprised expression",
  pointing: "Aira pointing to guide your attention",
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function AiraMascot({
  pose = "front",
  size = "md",
  idle = "float",
  sparkPulse = true,
  transition = "spring",
  className,
  "aria-label": ariaLabel,
  decorative = false,
  onAnimationStateChange,
  onPoseTransitionEnd,
}: AiraMascotProps) {
  const prefersReducedMotion = useReducedMotion();
  const prevPoseRef = useRef<AiraPose>(pose);

  // Resolve effective animation settings
  const effectiveIdle: IdleAnimation = prefersReducedMotion ? "none" : idle;
  const effectiveTransition: TransitionEffect = transition;

  const px = resolveSize(size);

  // Track animation state changes
  const updateAnimState = useCallback(
    (state: AnimationState) => {
      onAnimationStateChange?.(state);
    },
    [onAnimationStateChange],
  );

  // Detect pose changes
  useEffect(() => {
    if (prevPoseRef.current !== pose) {
      updateAnimState("transitioning");
      prevPoseRef.current = pose;
    }
  }, [pose, updateAnimState]);

  // Idle animation props
  const idleAnimateProps = useMemo(() => {
    if (effectiveIdle === "float") return FLOAT_KEYFRAMES;
    if (effectiveIdle === "breathe") return BREATHE_KEYFRAMES;
    return {};
  }, [effectiveIdle]);

  // Accessible label
  const label = ariaLabel ?? POSE_LABELS[pose] ?? `Aira in ${pose} pose`;
  const cellAspect = SPRITE_SHEET.cellWidth / SPRITE_SHEET.artHeight;
  const displayHeight = px / cellAspect;

  // Check if pose is a canonical sprite pose or extended
  const isCanonical = isCanonicalPose(pose);

  return (
    <motion.div
      className={`${styles.mascotRoot} ${className ?? ""}`}
      style={{ width: px, height: displayHeight }}
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      animate={idleAnimateProps}
    >
      {/* Sprite layer with cross-fade transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pose}
          className={styles.poseLayer}
          initial={
            effectiveTransition !== "none"
              ? { opacity: 0, scale: 0.92, y: 8 }
              : false
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            effectiveTransition !== "none"
              ? { opacity: 0, scale: 0.95, y: -4 }
              : undefined
          }
          transition={transitionConfig(effectiveTransition, Boolean(prefersReducedMotion))}
          onAnimationComplete={() => {
            updateAnimState("idle");
            onPoseTransitionEnd?.(pose);
          }}
        >
          {isCanonical ? (
            <AiraSprite
              pose={pose}
              size={size}
            />
          ) : (
            /* Extended poses rendered from individual images */
            <div
              className={styles.extendedPose}
              style={{
                width: px,
                height: displayHeight,
                backgroundImage: `url(/mascot/aira-${pose}.png)`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Spark pulse overlay (decorative, follows head position) */}
      {/* Spark glow pulse, anchored to the measured spark of each canonical pose */}
      {sparkPulse && isCanonical && (
        <motion.img
          key={`spark-${pose}`}
          alt=""
          aria-hidden="true"
          className={styles.sparkOverlay}
          src="/assets/generated/mascots/aira-spark.svg"
          style={{
            left: `${SPARK_ANCHORS[pose].xPct}%`,
            top: `${SPARK_ANCHORS[pose].yPct}%`,
            width: `${SPARK_ANCHORS[pose].sizePct * SPARK_GLOW_SCALE}%`,
          }}
          animate={prefersReducedMotion ? { opacity: 0.85 } : SPARK_PULSE}
        />
      )}
    </motion.div>
  );
}
