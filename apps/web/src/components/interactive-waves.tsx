"use client";

import { useEffect, useRef } from "react";

type Tone = "light" | "dark";

type InteractiveWavesProps = {
  /** Colour treatment for light (hero) or dark (navy CTA) sections. */
  tone?: Tone;
  /** Vertical centre of the wave band as a fraction of the section height. */
  band?: number;
  /** Band centre used below 920 px, where sections stack into one column. */
  bandCompact?: number;
  /** Fade the lines towards the left edge, keeping headline copy calm. */
  fadeLeft?: boolean;
  className?: string;
};

type Ripple = { x: number; y: number; start: number };

const PALETTES: Record<Tone, { line: string; accent: string; alpha: number; accentAlpha: number }> = {
  light: { line: "22, 85, 216", accent: "235, 157, 19", alpha: 0.28, accentAlpha: 0.55 },
  dark: { line: "255, 255, 255", accent: "235, 157, 19", alpha: 0.2, accentAlpha: 0.7 },
};

const RIPPLE_LIFE = 1.7; // seconds
const RIPPLE_SPEED = 380; // px per second
const MAX_RIPPLES = 4;
const NO_RIPPLE = "input, select, textarea, label, [data-no-ripple]";
/** After this long without pointer activity the ambient flow drops to ~30 fps. */
const IDLE_AFTER_MS = 4000;

/**
 * Brand "signal" lines that flow slowly, part smoothly around the cursor and
 * ripple outward from clicks or taps.
 *
 * Rendering is a single Canvas 2D layer behind the section content
 * (pointer-events: none), so it never intercepts clicks. Listeners live on the
 * parent section and are passive. The loop only runs while the section is on
 * screen and the tab is visible; reduced-motion and low-power devices get one
 * static frame. Everything is torn down on unmount, so route changes cannot
 * leave listeners or animation frames behind.
 */
export function InteractiveWaves({
  tone = "light",
  band = 0.55,
  bandCompact,
  fadeLeft = false,
  className,
}: InteractiveWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const palette = PALETTES[tone];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 2 || connection?.saveData === true;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let running = false;
    let onScreen = false;
    let lastFrame = 0;
    let clock = 0;
    let lastInput = 0;
    let frameCount = 0;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, energy: 0, targetEnergy: 0 };
    const ripples: Ripple[] = [];

    const animated = () => !reducedMotion.matches && !lowPower;

    function draw(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const compact = width < 920;
      const lines = width < 640 ? 5 : 7;
      const spacing = Math.min(26, Math.max(14, height * 0.03));
      const centre = height * (compact && bandCompact !== undefined ? bandCompact : band);
      const step = width < 640 ? 10 : 8;
      const accentIndex = Math.floor(lines / 2) + 1;

      for (let i = 0; i < lines; i += 1) {
        const offset = i - (lines - 1) / 2;
        const baseY = centre + offset * spacing;
        const amp = 15 - Math.abs(offset) * 2;
        const k = 0.0052 + i * 0.0006;
        const speed = 0.32 + i * 0.045;
        const phase = i * 0.9;
        const accent = i === accentIndex;

        ctx.beginPath();
        for (let x = -step; x <= width + step; x += step) {
          let y =
            baseY +
            amp * Math.sin(x * k + clock * speed + phase) +
            amp * 0.4 * Math.sin(x * k * 2.3 - clock * speed * 0.7 + phase * 1.7);

          // Lines part softly around the cursor, with a small travelling wobble.
          if (pointer.energy > 0.002) {
            const dx = x - pointer.x;
            const dy = baseY - pointer.y;
            const g =
              Math.exp(-(dx * dx) / (2 * 150 * 150)) * Math.exp(-(dy * dy) / (2 * 130 * 130));
            y += (dy >= 0 ? 1 : -1) * g * pointer.energy * 42;
            y += g * pointer.energy * 9 * Math.sin(dx * 0.045 - clock * 3);
          }

          // Click ripples: a damped wave front travelling outward.
          for (const ripple of ripples) {
            const age = (now - ripple.start) / 1000;
            const fade = Math.max(0, 1 - age / RIPPLE_LIFE);
            const d = Math.hypot(x - ripple.x, baseY - ripple.y) - age * RIPPLE_SPEED;
            y += fade * fade * 26 * Math.exp(-(d * d) / (2 * 30 * 30)) * Math.cos(d * 0.11);
          }

          if (x === -step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const rgb = accent ? palette.accent : palette.line;
        const alpha = (accent ? palette.accentAlpha : palette.alpha) * (1 - Math.abs(offset) * 0.08);
        if (fadeLeft) {
          const gradient = ctx.createLinearGradient(0, 0, width, 0);
          // Nearly invisible across the copy column, full strength from the art onward.
          gradient.addColorStop(0, `rgba(${rgb}, ${alpha * 0.04})`);
          gradient.addColorStop(compact ? 0.15 : 0.34, `rgba(${rgb}, ${alpha * 0.12})`);
          gradient.addColorStop(compact ? 0.4 : 0.5, `rgba(${rgb}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${rgb}, ${alpha})`);
          ctx.strokeStyle = gradient;
        } else {
          ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
        }
        ctx.lineWidth = accent ? 2 : 1.5;
        ctx.stroke();
      }

      // Faint expanding rings make the ripple origin legible.
      for (const ripple of ripples) {
        const age = (now - ripple.start) / 1000;
        const fade = Math.max(0, 1 - age / RIPPLE_LIFE);
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, age * RIPPLE_SPEED, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${palette.line}, ${0.32 * fade * fade})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      clock += dt;

      // Frame-rate independent easing towards the real pointer.
      const follow = 1 - Math.exp(-dt * 7);
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      pointer.energy += (pointer.targetEnergy - pointer.energy) * (1 - Math.exp(-dt * 4));

      while (ripples.length && (now - ripples[0].start) / 1000 > RIPPLE_LIFE) ripples.shift();

      // Idle and calm: only the slow ambient flow is moving, so every other
      // frame is enough. The clock still advances by real time, so the motion
      // speed is unchanged.
      frameCount += 1;
      // A resting cursor counts as idle once the lines have settled around it.
      const settled =
        Math.abs(pointer.targetX - pointer.x) < 0.5 &&
        Math.abs(pointer.targetY - pointer.y) < 0.5 &&
        Math.abs(pointer.targetEnergy - pointer.energy) < 0.01;
      const idle = now - lastInput > IDLE_AFTER_MS && ripples.length === 0 && settled;
      if (!idle || frameCount % 2 === 0) draw(now);
      frameId = requestAnimationFrame(frame);
    }

    function start() {
      if (running || !animated()) return;
      running = true;
      lastFrame = performance.now();
      frameId = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frameId);
    }

    function sync() {
      if (onScreen && !document.hidden && animated()) start();
      else {
        stop();
        if (!animated()) {
          ripples.length = 0;
          pointer.energy = 0;
          draw(performance.now());
        }
      }
    }

    function resize() {
      if (!canvas || !ctx || !host) return;
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, finePointer ? 1.75 : 1.25);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw(performance.now());
    }

    function localPoint(event: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function handleMove(event: PointerEvent) {
      lastInput = performance.now();
      if (!running || event.pointerType !== "mouse") return;
      const point = localPoint(event);
      if (pointer.energy < 0.02) {
        // Entering: start from the cursor instead of sweeping across the section.
        pointer.x = point.x;
        pointer.y = point.y;
      }
      pointer.targetX = point.x;
      pointer.targetY = point.y;
      pointer.targetEnergy = 1;
    }

    function handleLeave() {
      pointer.targetEnergy = 0;
    }

    function handleDown(event: PointerEvent) {
      lastInput = performance.now();
      if (!running) return;
      if (event.target instanceof Element && event.target.closest(NO_RIPPLE)) return;
      const point = localPoint(event);
      ripples.push({ ...point, start: performance.now() });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    visibility.observe(host);

    const listenerOptions: AddEventListenerOptions = { passive: true };
    if (finePointer) {
      host.addEventListener("pointermove", handleMove, listenerOptions);
      host.addEventListener("pointerleave", handleLeave, listenerOptions);
    }
    host.addEventListener("pointerdown", handleDown, listenerOptions);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    resize();

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      host.removeEventListener("pointermove", handleMove);
      host.removeEventListener("pointerleave", handleLeave);
      host.removeEventListener("pointerdown", handleDown);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, [tone, band, bandCompact, fadeLeft]);

  return (
    <canvas
      aria-hidden="true"
      className={`interactive-waves ${className ?? ""}`}
      data-tone={tone}
      ref={canvasRef}
    />
  );
}
