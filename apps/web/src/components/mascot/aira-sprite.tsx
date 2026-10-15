"use client";

/**
 * Aira Mascot — Sprite-based renderer
 *
 * Renders a single pose from the canonical 4×2 sprite sheet using
 * CSS background-position. This avoids loading 8 separate images
 * and gives instant pose switching with zero network latency.
 */

import Image from "next/image";

import type { CanonicalPose, AiraSize } from "./types";
import { SPRITE_SHEET, resolveSize } from "./types";

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
  const displayHeight = px * (SPRITE_SHEET.artHeight / SPRITE_SHEET.cellWidth);

  return (
    <Image
      alt=""
      aria-hidden="true"
      className={className}
      height={SPRITE_SHEET.artHeight}
      src={`/mascot/canonical/aira-${pose}.png`}
      style={{ height: displayHeight, width: px }}
      unoptimized
      width={SPRITE_SHEET.cellWidth}
    />
  );
}
