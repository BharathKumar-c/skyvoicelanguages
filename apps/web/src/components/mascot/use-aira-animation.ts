"use client";

/**
 * Aira Mascot — Animation Controller Hook
 *
 * Manages the mascot's animation state machine, providing
 * contextual pose selection and state-driven transitions.
 * Designed for future integration with real-time AI voice.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type { AiraPose, AnimationState } from "./types";

/* ------------------------------------------------------------------ */
/*  State machine                                                     */
/* ------------------------------------------------------------------ */

interface AiraAnimationConfig {
  /** Initial pose. Defaults to "front". */
  initialPose?: AiraPose;
  /** Duration (ms) before auto-returning to idle pose. 0 = never. */
  autoReturnMs?: number;
  /** Pose used for idle state. Defaults to "front". */
  idlePose?: AiraPose;
  /** Whether the mascot is in an active listening session. */
  isListening?: boolean;
  /** Whether the mascot is in an active speaking session. */
  isSpeaking?: boolean;
}

interface AiraAnimationReturn {
  /** Current active pose. */
  pose: AiraPose;
  /** Current animation state. */
  animationState: AnimationState;
  /** Transition to a new pose. */
  setPose: (pose: AiraPose) => void;
  /** Play a celebration sequence (auto-returns to idle). */
  celebrate: () => void;
  /** Play a thinking sequence. */
  startThinking: () => void;
  /** Stop thinking and return to idle. */
  stopThinking: () => void;
  /** Respond to correct/incorrect answers. */
  reactToAnswer: (correct: boolean) => void;
  /** Reset to idle state. */
  reset: () => void;
}

export function useAiraAnimation({
  initialPose = "front",
  autoReturnMs = 3000,
  idlePose = "front",
  isListening = false,
  isSpeaking = false,
}: AiraAnimationConfig = {}): AiraAnimationReturn {
  const [pose, setPoseState] = useState<AiraPose>(initialPose);
  const [animationState, setAnimationState] = useState<AnimationState>("idle");
  const returnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending auto-return
  const clearAutoReturn = useCallback(() => {
    if (returnTimerRef.current) {
      clearTimeout(returnTimerRef.current);
      returnTimerRef.current = null;
    }
  }, []);

  // Schedule auto-return to idle
  const scheduleReturn = useCallback(
    (ms?: number) => {
      clearAutoReturn();
      const delay = ms ?? autoReturnMs;
      if (delay > 0) {
        returnTimerRef.current = setTimeout(() => {
          setPoseState(idlePose);
          setAnimationState("idle");
        }, delay);
      }
    },
    [autoReturnMs, clearAutoReturn, idlePose],
  );

  // Set pose with transition
  const setPose = useCallback(
    (newPose: AiraPose) => {
      clearAutoReturn();
      setPoseState(newPose);
      setAnimationState("transitioning");
    },
    [clearAutoReturn],
  );

  // Celebration sequence
  const celebrate = useCallback(() => {
    clearAutoReturn();
    setPoseState("celebration");
    setAnimationState("celebrating");
    scheduleReturn(4000);
  }, [clearAutoReturn, scheduleReturn]);

  // Thinking state
  const startThinking = useCallback(() => {
    clearAutoReturn();
    setPoseState("thinking");
    setAnimationState("thinking");
  }, [clearAutoReturn]);

  const stopThinking = useCallback(() => {
    setPoseState(idlePose);
    setAnimationState("idle");
  }, [idlePose]);

  // Answer reaction
  const reactToAnswer = useCallback(
    (correct: boolean) => {
      clearAutoReturn();
      if (correct) {
        setPoseState("celebration");
        setAnimationState("celebrating");
      } else {
        setPoseState("feedback");
        setAnimationState("transitioning");
      }
      scheduleReturn(correct ? 3000 : 2500);
    },
    [clearAutoReturn, scheduleReturn],
  );

  // Reset to idle
  const reset = useCallback(() => {
    clearAutoReturn();
    setPoseState(idlePose);
    setAnimationState("idle");
  }, [clearAutoReturn, idlePose]);

  // Respond to listening/speaking state from AI voice system
  useEffect(() => {
    if (isListening) {
      setPoseState("listening");
      setAnimationState("listening");
    } else if (isSpeaking) {
      setPoseState("speaking");
      setAnimationState("speaking");
    }
  }, [isListening, isSpeaking]);

  // Cleanup on unmount
  useEffect(() => clearAutoReturn, [clearAutoReturn]);

  return {
    pose,
    animationState,
    setPose,
    celebrate,
    startThinking,
    stopThinking,
    reactToAnswer,
    reset,
  };
}
