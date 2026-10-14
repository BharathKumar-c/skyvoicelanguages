"use client";

import { Check, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const previewSteps = [
  "Find your current level",
  "Spot the module holding you back",
  "Leave with a written roadmap",
];

export function VslPreview() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const triggerButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerButton.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButton.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        className="vsl-card"
        onClick={() => setOpen(true)}
        ref={triggerButton}
        type="button"
      >
        <span className="vsl-grid" aria-hidden="true" />
        <span className="vsl-orbit vsl-orbit-one" aria-hidden="true" />
        <span className="vsl-orbit vsl-orbit-two" aria-hidden="true" />
        <span className="vsl-copy">
          <span className="vsl-kicker">Assessment preview · 3 minutes</span>
          <strong>Why your score feels stuck—and what to do next.</strong>
          <span className="vsl-action">
            <span className="vsl-play">
              <Play aria-hidden="true" fill="currentColor" size={18} />
            </span>
            See what the assessment covers
          </span>
        </span>
        <span className="vsl-score" aria-hidden="true">
          <small>Target</small>
          <b>7.0</b>
          <span>Clear next step</span>
        </span>
      </button>

      {open ? (
        <div
          aria-labelledby="assessment-overview-title"
          aria-modal="true"
          className="dialog-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
          role="dialog"
        >
          <div className="dialog-card">
            <button
              aria-label="Close assessment overview"
              className="dialog-close"
              onClick={() => setOpen(false)}
              ref={closeButton}
              type="button"
            >
              <X aria-hidden="true" />
            </button>
            <span className="eyebrow">Your first clear step</span>
            <h2 id="assessment-overview-title">
              Know what to practise before you practise more.
            </h2>
            <p>
              The trainer-led video will be added after final production approval. The
              free assessment already has one simple job: turn a vague score problem
              into an actionable plan.
            </p>
            <ul className="dialog-list">
              {previewSteps.map((step) => (
                <li key={step}>
                  <Check aria-hidden="true" />
                  {step}
                </li>
              ))}
            </ul>
            <a className="button button-primary" href="#assessment-form" onClick={() => setOpen(false)}>
              Book my free assessment
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
