"use client";

import { RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="utility-page" id="main-content">
      <div className="utility-shell">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG illustration */}
        <img
          alt=""
          aria-hidden="true"
          className="utility-illustration utility-illustration-compact"
          height={220}
          src="/assets/generated/illustrations/signal-interrupted-error.svg"
          width={320}
        />
        <span className="eyebrow">Something went wrong</span>
        <h1>That step did not load correctly.</h1>
        <p>Your form details have not been submitted. Retry the page when you are ready.</p>
        <button className="button button-primary" onClick={reset} type="button">
          <RotateCcw aria-hidden="true" />
          Try again
        </button>
      </div>
    </main>
  );
}
