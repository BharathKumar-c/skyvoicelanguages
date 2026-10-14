"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="utility-page" id="main-content">
      <div className="utility-shell">
        <span className="success-icon error-icon">
          <AlertTriangle aria-hidden="true" />
        </span>
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
