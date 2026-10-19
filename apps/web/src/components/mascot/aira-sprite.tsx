"use client";

/**
 * Aira Mascot — Sprite-based renderer
 *
 * Renders one canonical pose from its individual transparent PNG export.
 * next/image serves it as WebP/AVIF at the displayed size.
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
  /** Above-the-fold placement: load eagerly with high fetch priority. */
  eager?: boolean;
}

/** Low-level renderer for one canonical pose. */
export function AiraSprite({ pose, size, className, eager = false }: AiraSpriteProps) {
  const px = resolveSize(size);
  const displayHeight = px * (SPRITE_SHEET.artHeight / SPRITE_SHEET.cellWidth);

  return (
    <Image
      alt=""
      aria-hidden="true"
      className={className}
      fetchPriority={eager ? "high" : undefined}
      height={SPRITE_SHEET.artHeight}
      loading={eager ? "eager" : "lazy"}
      sizes={`${px}px`}
      src={`/mascot/canonical/aira-${pose}.png`}
      style={{ height: displayHeight, width: px }}
      width={SPRITE_SHEET.cellWidth}
    />
  );
}
