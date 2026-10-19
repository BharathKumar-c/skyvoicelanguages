"use client";

import { useSyncExternalStore } from "react";

/**
 * Animation policy for visitors who ask for reduced motion (Windows "Show
 * animations" off, macOS/iOS "Reduce motion", Android "Remove animations"):
 *
 *   - Keep: opacity fades, colour/background/border/shadow transitions, small
 *     hover and press feedback, the loading spinner.
 *   - Replace: travel, zoom, rotation, drawing, and looping bobs. They become
 *     opacity-only versions with the same timing, or stay still when the
 *     movement is purely ambient (idle float, background waves).
 *
 * Content is never left hidden: every entrance still ends at full opacity.
 *
 * The same policy is mirrored in CSS under `@media (prefers-reduced-motion:
 * reduce)` in globals.css.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
// The server cannot know the preference, so it renders "false". In the browser
// the real value is used from the very first (hydrating) render, so entrances
// that start on mount never begin with the full-motion version. That is
// hydration-safe because components only vary *transitions* (and values that
// render identically, e.g. scale 1 vs. none), never the markup itself.
const getServerSnapshot = () => (typeof window === "undefined" ? false : getSnapshot());

/**
 * True when the visitor prefers reduced motion. It updates live if the setting
 * changes while the page is open; Motion's own useReducedMotion reads the
 * setting only once.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Shared easing used across the site's entrances. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Transition for an element that enters with a fade plus some movement.
 * Normally both animate together. Under reduced motion the movement snaps
 * instantly while the element is still transparent, so the visitor sees only
 * the fade, with the original duration, delay and easing.
 *
 * The animated *values* never change between modes, so server-rendered
 * markup (which includes the initial values) always matches the client.
 */
export function fadeFirstTransition(
  reduce: boolean,
  { duration, delay = 0, ease = EASE_OUT }: { duration: number; delay?: number; ease?: typeof EASE_OUT | "easeOut" },
  movingKeys: readonly string[],
) {
  const base = { delay, duration, ease };
  if (!reduce) return base;
  return {
    ...base,
    ...Object.fromEntries(movingKeys.map((key) => [key, { delay: 0, duration: 0 }])),
  };
}
