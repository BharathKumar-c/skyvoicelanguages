/**
 * Aira Mascot System — Core Types
 *
 * Type definitions for the SkyVoice Signal Navigator mascot component.
 * Follows the 24-point locked anatomy specification and style bible.
 */

/* ------------------------------------------------------------------ */
/*  Canonical poses (existing 8 + expanded set)                       */
/* ------------------------------------------------------------------ */

/** The eight canonical poses from the production sprite sheet. */
export type CanonicalPose =
  | "front"
  | "three-quarter"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "feedback"
  | "celebration";

/** Extended poses planned for Phase 3 expansion. */
export type ExtendedPose =
  | "thinking"
  | "waving"
  | "surprised"
  | "pointing"
  | "sitting"
  | "walking"
  | "thumbs-up"
  | "encouraging"
  | "studying"
  | "medal"
  | "presenting"
  | "sleeping";

/** All available mascot poses. */
export type AiraPose = CanonicalPose | ExtendedPose;

/* ------------------------------------------------------------------ */
/*  Emotions                                                          */
/* ------------------------------------------------------------------ */

/** Core expression set (faces only — brows, lids, pupils, mouth). */
export type AiraEmotion =
  | "welcome"
  | "confidence"
  | "curiosity"
  | "clarity"
  | "focus"
  | "concentration"
  | "reassurance"
  | "joy"
  | "thinking"
  | "surprised"
  | "encouraging"
  | "determined"
  | "proud"
  | "waving";

/* ------------------------------------------------------------------ */
/*  Animation                                                         */
/* ------------------------------------------------------------------ */

/** Idle animation variant. */
export type IdleAnimation = "float" | "breathe" | "none";

/** Named transition effect between poses. */
export type TransitionEffect = "spring" | "ease" | "snap" | "none";

/** Animation state machine states. */
export type AnimationState =
  | "idle"
  | "entering"
  | "transitioning"
  | "celebrating"
  | "listening"
  | "speaking"
  | "thinking"
  | "exiting";

/* ------------------------------------------------------------------ */
/*  Sprite configuration                                              */
/* ------------------------------------------------------------------ */

/** Sprite sheet cell coordinates (zero-indexed grid position). */
export interface SpriteCell {
  /** Column index (0-based, left to right). */
  col: number;
  /** Row index (0-based, top to bottom). */
  row: number;
}

/** Maps each canonical pose to its sprite sheet cell. */
export const CANONICAL_POSE_CELLS: Record<CanonicalPose, SpriteCell> = {
  front:          { col: 0, row: 0 },
  "three-quarter": { col: 1, row: 0 },
  listening:      { col: 2, row: 0 },
  speaking:       { col: 3, row: 0 },
  reading:        { col: 0, row: 1 },
  writing:        { col: 1, row: 1 },
  feedback:       { col: 2, row: 1 },
  celebration:    { col: 3, row: 1 },
};

/** Production sprite sheet dimensions. */
export const SPRITE_SHEET = {
  /** Full sheet width in pixels. */
  width: 1536,
  /** Full sheet height in pixels. */
  height: 1024,
  /** Number of columns in the grid. */
  cols: 4,
  /** Number of rows in the grid. */
  rows: 2,
  /** Width of each cell. */
  cellWidth: 384,
  /** Height of each cell. */
  cellHeight: 512,
} as const;

/* ------------------------------------------------------------------ */
/*  Component props                                                   */
/* ------------------------------------------------------------------ */

/** Responsive size presets. */
export type AiraSize =
  | "xs"      // 48px  — favicon / notification badge
  | "sm"      // 96px  — navigation accent / mobile compact
  | "md"      // 160px — inline companion
  | "lg"      // 240px — section illustration
  | "xl"      // 360px — hero featured
  | "full"    // 480px — maximum display
  | number;   // Custom px value

/** Core Aira mascot component props. */
export interface AiraMascotProps {
  /** Which pose to display. Defaults to "front". */
  pose?: AiraPose;

  /** Target display size. Defaults to "md". */
  size?: AiraSize;

  /** Idle animation variant. Defaults to "float". */
  idle?: IdleAnimation;

  /** Whether to animate the spark. Defaults to true. */
  sparkPulse?: boolean;

  /** Transition effect when pose changes. Defaults to "spring". */
  transition?: TransitionEffect;

  /** Additional CSS class name. */
  className?: string;

  /** Accessible label override. */
  "aria-label"?: string;

  /** Whether the mascot is purely decorative. Defaults to false. */
  decorative?: boolean;

  /** Called when an animation state changes. */
  onAnimationStateChange?: (state: AnimationState) => void;

  /** Called when a pose transition completes. */
  onPoseTransitionEnd?: (pose: AiraPose) => void;
}

/* ------------------------------------------------------------------ */
/*  Brand palette (locked)                                            */
/* ------------------------------------------------------------------ */

export const AIRA_PALETTE = {
  navy:   "#0E2D5E",
  cobalt: "#1655D8",
  orange: "#EB9D13",
  cream:  "#FFF4D6",
  white:  "#FFFFFF",
} as const;

/* ------------------------------------------------------------------ */
/*  Size map                                                          */
/* ------------------------------------------------------------------ */

/** Resolves a named size to a pixel value. */
export function resolveSize(size: AiraSize): number {
  if (typeof size === "number") return size;
  const MAP: Record<Exclude<AiraSize, number>, number> = {
    xs:   48,
    sm:   96,
    md:   160,
    lg:   240,
    xl:   360,
    full: 480,
  };
  return MAP[size];
}
