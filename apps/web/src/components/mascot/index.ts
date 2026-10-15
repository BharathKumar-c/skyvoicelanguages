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
export { AiraContext, AiraModule } from "./aira-context";
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

export {
  AIRA_PALETTE,
  CANONICAL_POSE_CELLS,
  SPRITE_SHEET,
  resolveSize,
} from "./types";
