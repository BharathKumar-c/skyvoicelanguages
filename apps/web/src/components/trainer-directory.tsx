"use client";

import { Award, Clock3, PlayCircle, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Trainer } from "@/content/about";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/merge";

import { ServiceVideo } from "./service-video";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function TrainerPhoto({ trainer, sizes }: { trainer: Trainer; sizes: string }) {
  if (trainer.photo) {
    return <Image alt={trainer.photo.alt} fill sizes={sizes} src={trainer.photo.src} />;
  }
  return (
    <span aria-hidden="true" className="trainer-monogram">
      {initials(trainer.name)}
    </span>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

function TrainerProfile({ trainer, onClose }: { trainer: Trainer; onClose: () => void }) {
  const t = useI18n().m.trainer;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `trainer-${trainer.id}-title`;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      // Keep keyboard focus inside the dialog while it is open.
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      role="dialog"
    >
      <div className="dialog-card trainer-dialog" ref={dialogRef}>
        <button
          aria-label={format(t.closeProfile, { name: trainer.name })}
          className="dialog-close"
          onClick={onClose}
          ref={closeRef}
          type="button"
        >
          <X aria-hidden="true" />
        </button>

        <div className="trainer-dialog-head">
          <div className="trainer-dialog-photo">
            <TrainerPhoto sizes="120px" trainer={trainer} />
          </div>
          <div>
            <span className="eyebrow">{trainer.designation}</span>
            <h2 id={titleId}>{trainer.name}</h2>
            {trainer.experienceYears ? (
              <p className="trainer-meta">
                <Clock3 aria-hidden="true" /> {format(t.yearsTeaching, { years: trainer.experienceYears })}
              </p>
            ) : null}
          </div>
        </div>

        <p className="trainer-bio">{trainer.bio}</p>

        <div className="trainer-dialog-grid">
          {trainer.qualifications.length ? (
            <div>
              <h3>{t.qualifications}</h3>
              <ul className="trainer-list">
                {trainer.qualifications.map((item) => (
                  <li key={item}>
                    <Award aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {trainer.achievements?.length ? (
            <div>
              <h3>{t.achievements}</h3>
              <ul className="trainer-list">
                {trainer.achievements.map((item) => (
                  <li key={item}>
                    <Award aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {trainer.expertise.length ? (
            <div>
              <h3>{t.expertise}</h3>
              <ul className="trainer-chips">
                {trainer.expertise.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <h3 className="trainer-video-title">{t.videoIntro}</h3>
        <ServiceVideo
          variant="compact"
          video={
            trainer.video ?? {
              src: null,
              type: "video/mp4",
              captions: null,
              poster: "/assets/generated/images/service-video-poster-feature.webp",
              title: format(t.meet, { name: trainer.name }),
              label: t.introduction,
            }
          }
          whenUnavailable="notice"
        />
      </div>
    </div>
  );
}

/** Responsive trainer cards with a full-profile dialog. */
export function TrainerDirectory({ trainers }: { trainers: Trainer[] }) {
  const t = useI18n().m.trainer;
  const [openId, setOpenId] = useState<string | null>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const open = trainers.find((trainer) => trainer.id === openId) ?? null;

  // Stable identity so the dialog's effect (focus, scroll lock) runs once.
  const close = useCallback(() => {
    setOpenId((id) => {
      if (id) requestAnimationFrame(() => triggers.current.get(id)?.focus());
      return null;
    });
  }, []);

  return (
    <>
      <ul className="trainer-grid">
        {trainers.map((trainer) => (
          <li className="trainer-card" key={trainer.id}>
            <div className="trainer-photo">
              <TrainerPhoto sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 360px" trainer={trainer} />
              <span className="trainer-video-badge">
                <PlayCircle aria-hidden="true" />
                {trainer.video?.src ? t.videoIntro : t.videoSoon}
              </span>
            </div>
            <div className="trainer-body">
              <h3>{trainer.name}</h3>
              <p className="trainer-role">{trainer.designation}</p>
              {trainer.experienceYears ? (
                <p className="trainer-meta">
                  <Clock3 aria-hidden="true" /> {format(t.yearsTeaching, { years: trainer.experienceYears })}
                </p>
              ) : null}
              {trainer.qualifications.length ? (
                <ul className="trainer-chips">
                  {trainer.qualifications.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              <button
                aria-haspopup="dialog"
                className="button button-secondary trainer-view"
                onClick={() => setOpenId(trainer.id)}
                ref={(element) => {
                  if (element) triggers.current.set(trainer.id, element);
                  else triggers.current.delete(trainer.id);
                }}
                type="button"
              >
                {t.viewProfile}
                <span className="sr-only">{format(t.viewProfileOf, { name: trainer.name })}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      {open ? <TrainerProfile onClose={close} trainer={open} /> : null}
    </>
  );
}
