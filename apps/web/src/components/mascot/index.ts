/**
 * Aira Mascot System — Public API
 *
 * Single import point for all mascot components and utilities.
 *
 * @example
 * ```tsx
 * import { AiraMascot, AiraContext, AiraModule, useAiraAnimation } from "@/components/mascot";
 * ```
 */

export { AiraMascot } from "./aira-mascot";
export { AiraSprite } from "./aira-sprite";
export { AiraGroundShadow } from "./aira-ground-shadow";
export { AiraContext, AiraModule } from "./aira-context";
export { SkillSignal } from "./skill-signal";
export { useAiraAnimation } from "./use-aira-animation";

export type {
  AiraMascotProps,
  AiraPose,
  CanonicalPose,
  ExtendedPose,
  AiraEmotion,
  AiraSize,
  AnimationState,
  IdleAnimation,
  TransitionEffect,
  SpriteCell,
} from "./types";

export type { SkillSignalModule, SkillSignalState } from "./skill-signal";

export {
  AIRA_PALETTE,
  CANONICAL_POSE_CELLS,
  SPARK_ANCHORS,
  SPRITE_SHEET,
  resolveSize,
} from "./types";
