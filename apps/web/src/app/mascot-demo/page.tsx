/**
 * Aira Mascot Demo Page
 *
 * Interactive development reference for all mascot states.
 * Route: /mascot-demo (development only — not linked in production nav)
 *
 * Shows:
 *  - All 8 canonical poses
 *  - 4 extended poses
 *  - All size presets
 *  - Live animation hook demo
 *  - Context presets
 */

"use client";

import { AiraMascot, AiraContext, AiraModule, useAiraAnimation } from "@/components/mascot";
import type { AiraPose, AiraSize } from "@/components/mascot";

const CANONICAL_POSES: AiraPose[] = [
  "front",
  "three-quarter",
  "listening",
  "speaking",
  "reading",
  "writing",
  "feedback",
  "celebration",
];

const EXTENDED_POSES: AiraPose[] = [
  "thinking",
  "waving",
  "surprised",
  "pointing",
];

const SIZES: AiraSize[] = ["xs", "sm", "md", "lg", "xl"];

const SIZE_LABELS: Record<string, string> = {
  xs: "xs · 48px",
  sm: "sm · 96px",
  md: "md · 160px",
  lg: "lg · 240px",
  xl: "xl · 360px",
};

function PoseGrid({ poses, title }: { poses: AiraPose[]; title: string }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2 style={{ color: "#0E2D5E", marginBottom: 32 }}>{title}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 24,
        }}
      >
        {poses.map((pose) => (
          <div
            key={pose}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: 20,
              background: "#f6f9ff",
              borderRadius: 16,
              border: "2px solid #d7e1ef",
            }}
          >
            <AiraMascot pose={pose} size="md" />
            <code
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1655D8",
                background: "#edf3ff",
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              {pose}
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnimationDemo() {
  const {
    pose,
    animationState,
    celebrate,
    startThinking,
    stopThinking,
    reactToAnswer,
    reset,
    setPose,
  } = useAiraAnimation({ idlePose: "front" });

  return (
    <section style={{ marginBottom: 64 }}>
      <h2 style={{ color: "#0E2D5E", marginBottom: 24 }}>
        Animation State Machine
      </h2>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
        <AiraMascot pose={pose} size="lg" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "#edf3ff",
              borderRadius: 12,
              padding: "10px 16px",
              fontFamily: "monospace",
              fontSize: 14,
            }}
          >
            <strong>pose:</strong> {pose}
            <br />
            <strong>state:</strong> {animationState}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {(
              [
                ["celebrate()", celebrate],
                ["startThinking()", startThinking],
                ["stopThinking()", stopThinking],
                ["reactToAnswer(true)", () => reactToAnswer(true)],
                ["reactToAnswer(false)", () => reactToAnswer(false)],
                ["reset()", reset],
                ["setPose('waving')", () => setPose("waving")],
                ["setPose('pointing')", () => setPose("pointing")],
              ] as [string, () => void][]
            ).map(([label, handler]) => (
              <button
                key={label}
                onClick={handler}
                style={{
                  background: "#1655D8",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "monospace",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SizeDemo() {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2 style={{ color: "#0E2D5E", marginBottom: 32 }}>Size Presets</h2>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-end", flexWrap: "wrap" }}>
        {SIZES.map((size) => (
          <div
            key={String(size)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AiraMascot pose="front" size={size} />
            <code style={{ fontSize: 12, color: "#52657a", fontWeight: 700 }}>
              {SIZE_LABELS[String(size)]}
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContextDemo() {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2 style={{ color: "#0E2D5E", marginBottom: 24 }}>Context Presets</h2>
      <p style={{ color: "#52657a", marginBottom: 32 }}>
        Pre-configured wrappers for common page sections.
      </p>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-end" }}>
        {(["hero", "listening", "reading", "writing", "speaking", "feedback", "celebration", "thank-you"] as const).map(
          (ctx) => (
            <div key={ctx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <AiraContext context={ctx} size="md" />
              <code style={{ fontSize: 11, color: "#1655D8", background: "#edf3ff", padding: "3px 8px", borderRadius: 999 }}>
                {ctx}
              </code>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

function ModuleDemo() {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2 style={{ color: "#0E2D5E", marginBottom: 24 }}>IELTS Module Poses</h2>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-end" }}>
        {(["listening", "reading", "writing", "speaking"] as const).map((mod) => (
          <div key={mod} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <AiraModule module={mod} size="md" />
            <span style={{ fontWeight: 700, color: "#0E2D5E", textTransform: "capitalize" }}>{mod}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MascotDemoPage() {
  return (
    <main
      style={{
        padding: "48px 32px",
        maxWidth: 1200,
        margin: "0 auto",
        fontFamily: "var(--font-nunito), sans-serif",
      }}
    >
      <h1 style={{ color: "#0E2D5E", marginBottom: 8 }}>
        Aira — Signal Navigator Mascot Demo
      </h1>
      <p style={{ color: "#52657a", marginBottom: 56, fontSize: 16 }}>
        SkyVoice mascot component system · {CANONICAL_POSES.length} canonical + {EXTENDED_POSES.length} extended poses
      </p>

      <PoseGrid poses={CANONICAL_POSES} title="Canonical Poses (Sprite Sheet)" />
      <PoseGrid poses={EXTENDED_POSES} title="Extended Poses (Phase 3)" />
      <SizeDemo />
      <AnimationDemo />
      <ContextDemo />
      <ModuleDemo />
    </main>
  );
}
