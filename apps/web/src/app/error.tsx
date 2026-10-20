"use client";

import { RotateCcw } from "lucide-react";

import { useI18n } from "@/i18n/client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useI18n().m.errorPage;
  return (
    <main className="utility-page" id="main-content">
      <div className="utility-shell">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG illustration */}
        <img
          alt=""
          aria-hidden="true"
          className="utility-illustration utility-illustration-compact"
          height={220}
          loading="lazy"
          src="/assets/generated/illustrations/signal-interrupted-error.svg"
          width={320}
        />
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <button className="button button-primary" onClick={reset} type="button">
          <RotateCcw aria-hidden="true" />
          {t.retry}
        </button>
      </div>
    </main>
  );
}
