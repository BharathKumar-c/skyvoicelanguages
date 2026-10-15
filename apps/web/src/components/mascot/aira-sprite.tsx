"use client";

/**
 * Aira Mascot — Sprite-based renderer
 *
 * Renders a single pose from the canonical 4×2 sprite sheet using
 * CSS background-position. This avoids loading 8 separate images
 * and gives instant pose switching with zero network latency.
 */

import { useMemo } from "react";

import type { CanonicalPose, AiraSize } from "./types";
import { CANONICAL_POSE_CELLS, SPRITE_SHEET, resolveSize } from "./types";

interface AiraSpriteProps {
  /** Canonical pose to display. */
  pose: CanonicalPose;
  /** Display size. */
  size: AiraSize;
  /** Additional class name for the wrapper. */
  className?: string;
}

/**
 * Low-level sprite renderer. Crops the correct cell from the
 * production sprite sheet using CSS `background-position`.
 */
export function AiraSprite({ pose, size, className }: AiraSpriteProps) {
  const px = resolveSize(size);

  const style = useMemo(() => {
    const cell = CANONICAL_POSE_CELLS[pose];
    const { cols, rows } = SPRITE_SHEET;

    // Scale the sprite sheet so that each cell fills `px` width.
    // The aspect ratio of each cell is cellWidth:cellHeight = 384:512 = 3:4
    const cellAspect = SPRITE_SHEET.cellWidth / SPRITE_SHEET.cellHeight;
    const displayHeight = px / cellAspect;
    const sheetDisplayWidth = px * cols;
    const sheetDisplayHeight = displayHeight * rows;

    return {
      width: px,
      height: displayHeight,
      backgroundImage: "url(/mascot/lead-mascot-sheet.png)",
      backgroundSize: `${sheetDisplayWidth}px ${sheetDisplayHeight}px`,
      backgroundPosition: `-${cell.col * px}px -${cell.row * displayHeight}px`,
      backgroundRepeat: "no-repeat" as const,
      imageRendering: "auto" as const,
    };
  }, [pose, px]);

  return (
    <div
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}
