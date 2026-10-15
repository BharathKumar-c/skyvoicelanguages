/**
 * Aira Mascot — Component Unit Tests
 *
 * Tests character consistency, animation hook behavior,
 * accessibility, and pose/size resolution utilities.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

import {
  CANONICAL_POSE_CELLS,
  SPRITE_SHEET,
  resolveSize,
  AIRA_PALETTE,
} from "../types";
import { useAiraAnimation } from "../use-aira-animation";
import { renderHook } from "@testing-library/react";

/* ------------------------------------------------------------------ */
/*  1. Type and configuration integrity                               */
/* ------------------------------------------------------------------ */

describe("SPRITE_SHEET constants", () => {
  it("has a 4×2 grid", () => {
    expect(SPRITE_SHEET.cols).toBe(4);
    expect(SPRITE_SHEET.rows).toBe(2);
  });

  it("cell dimensions match sheet dimensions", () => {
    expect(SPRITE_SHEET.cellWidth).toBe(SPRITE_SHEET.width / SPRITE_SHEET.cols);
    expect(SPRITE_SHEET.cellHeight).toBe(SPRITE_SHEET.height / SPRITE_SHEET.rows);
  });

  it("has exactly 8 canonical pose cells", () => {
    expect(Object.keys(CANONICAL_POSE_CELLS)).toHaveLength(8);
  });

  it("all cells are within grid bounds", () => {
    for (const [pose, cell] of Object.entries(CANONICAL_POSE_CELLS)) {
      expect(cell.col, `${pose} col`).toBeGreaterThanOrEqual(0);
      expect(cell.col, `${pose} col`).toBeLessThan(SPRITE_SHEET.cols);
      expect(cell.row, `${pose} row`).toBeGreaterThanOrEqual(0);
      expect(cell.row, `${pose} row`).toBeLessThan(SPRITE_SHEET.rows);
    }
  });

  it("no two canonical poses share the same cell", () => {
    const seen = new Set<string>();
    for (const [pose, cell] of Object.entries(CANONICAL_POSE_CELLS)) {
      const key = `${cell.col},${cell.row}`;
      expect(seen.has(key), `${pose} has a unique cell`).toBe(false);
      seen.add(key);
    }
  });
});

/* ------------------------------------------------------------------ */
/*  2. Size resolution                                                */
/* ------------------------------------------------------------------ */

describe("resolveSize", () => {
  it("resolves named sizes to expected pixel values", () => {
    expect(resolveSize("xs")).toBe(48);
    expect(resolveSize("sm")).toBe(96);
    expect(resolveSize("md")).toBe(160);
    expect(resolveSize("lg")).toBe(240);
    expect(resolveSize("xl")).toBe(360);
    expect(resolveSize("full")).toBe(480);
  });

  it("passes through numeric values unchanged", () => {
    expect(resolveSize(128)).toBe(128);
    expect(resolveSize(300)).toBe(300);
  });

  it("resolveSize('sm') passes the 96px minimum QA requirement", () => {
    expect(resolveSize("sm")).toBeGreaterThanOrEqual(96);
  });
});

/* ------------------------------------------------------------------ */
/*  3. Brand palette lock                                             */
/* ------------------------------------------------------------------ */

describe("AIRA_PALETTE", () => {
  it("contains all required brand colors", () => {
    expect(AIRA_PALETTE.navy).toBe("#0E2D5E");
    expect(AIRA_PALETTE.cobalt).toBe("#1655D8");
    expect(AIRA_PALETTE.orange).toBe("#EB9D13");
    expect(AIRA_PALETTE.cream).toBe("#FFF4D6");
    expect(AIRA_PALETTE.white).toBe("#FFFFFF");
  });
});

/* ------------------------------------------------------------------ */
/*  4. Animation hook — state machine                                 */
/* ------------------------------------------------------------------ */

describe("useAiraAnimation", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts in the idle state with the default pose", () => {
    const { result } = renderHook(() => useAiraAnimation());
    expect(result.current.pose).toBe("front");
    expect(result.current.animationState).toBe("idle");
  });

  it("respects a custom initialPose", () => {
    const { result } = renderHook(() =>
      useAiraAnimation({ initialPose: "listening" }),
    );
    expect(result.current.pose).toBe("listening");
  });

  it("setPose changes the pose", () => {
    const { result } = renderHook(() => useAiraAnimation());
    act(() => result.current.setPose("speaking"));
    expect(result.current.pose).toBe("speaking");
    expect(result.current.animationState).toBe("transitioning");
  });

  it("celebrate switches to celebration state", () => {
    const { result } = renderHook(() => useAiraAnimation());
    act(() => result.current.celebrate());
    expect(result.current.pose).toBe("celebration");
    expect(result.current.animationState).toBe("celebrating");
  });

  it("celebrate auto-returns to idle after 4 s", () => {
    const { result } = renderHook(() => useAiraAnimation({ idlePose: "front" }));
    act(() => result.current.celebrate());
    expect(result.current.pose).toBe("celebration");
    act(() => vi.advanceTimersByTime(4000));
    expect(result.current.pose).toBe("front");
    expect(result.current.animationState).toBe("idle");
  });

  it("startThinking enters thinking state", () => {
    const { result } = renderHook(() => useAiraAnimation());
    act(() => result.current.startThinking());
    expect(result.current.pose).toBe("thinking");
    expect(result.current.animationState).toBe("thinking");
  });

  it("stopThinking returns to idle pose", () => {
    const { result } = renderHook(() =>
      useAiraAnimation({ idlePose: "three-quarter" }),
    );
    act(() => result.current.startThinking());
    act(() => result.current.stopThinking());
    expect(result.current.pose).toBe("three-quarter");
    expect(result.current.animationState).toBe("idle");
  });

  it("reactToAnswer(true) triggers celebration", () => {
    const { result } = renderHook(() => useAiraAnimation());
    act(() => result.current.reactToAnswer(true));
    expect(result.current.pose).toBe("celebration");
    expect(result.current.animationState).toBe("celebrating");
  });

  it("reactToAnswer(false) shows feedback pose", () => {
    const { result } = renderHook(() => useAiraAnimation());
    act(() => result.current.reactToAnswer(false));
    expect(result.current.pose).toBe("feedback");
  });

  it("reset returns to idlePose", () => {
    const { result } = renderHook(() =>
      useAiraAnimation({ idlePose: "front" }),
    );
    act(() => result.current.celebrate());
    act(() => result.current.reset());
    expect(result.current.pose).toBe("front");
    expect(result.current.animationState).toBe("idle");
  });

  it("isListening drives the listening pose", () => {
    const { result, rerender } = renderHook(
      ({ isListening }: { isListening: boolean }) =>
        useAiraAnimation({ isListening }),
      { initialProps: { isListening: false } },
    );
    expect(result.current.pose).toBe("front");

    rerender({ isListening: true });
    expect(result.current.pose).toBe("listening");
    expect(result.current.animationState).toBe("listening");
  });

  it("isSpeaking drives the speaking pose", () => {
    const { result, rerender } = renderHook(
      ({ isSpeaking }: { isSpeaking: boolean }) =>
        useAiraAnimation({ isSpeaking }),
      { initialProps: { isSpeaking: false } },
    );
    rerender({ isSpeaking: true });
    expect(result.current.pose).toBe("speaking");
    expect(result.current.animationState).toBe("speaking");
  });
});

/* ------------------------------------------------------------------ */
/*  5. Pose set completeness                                          */
/* ------------------------------------------------------------------ */

describe("canonical pose completeness", () => {
  const expectedPoses = [
    "front",
    "three-quarter",
    "listening",
    "speaking",
    "reading",
    "writing",
    "feedback",
    "celebration",
  ];

  it.each(expectedPoses)("'%s' has a sprite cell", (pose) => {
    expect(CANONICAL_POSE_CELLS).toHaveProperty(pose);
  });
});
