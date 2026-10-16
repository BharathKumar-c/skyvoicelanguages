"use client";

import { Check, Clock3, Expand, Play, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { serviceVideo, type VideoConfig } from "@/config/media";

const overviewSteps = [
  "Find your current level",
  "Spot the module holding you back",
  "Leave with a written roadmap",
];

const EASE = [0.22, 1, 0.36, 1] as const;

/** Every mounted player, so starting one pauses the others. */
const players = new Set<HTMLVideoElement>();

type ServiceVideoProps = {
  video?: VideoConfig;
  /** "feature" for the full-width section, "compact" for the hero preview. */
  variant?: "feature" | "compact";
  /**
   * Without a source: "overview" opens the written assessment overview (landing
   * page); "notice" shows a static, non-interactive "coming soon" preview.
   */
  whenUnavailable?: "overview" | "notice";
  /** Extra class name for the video frame. */
  className?: string;
};

/**
 * Click-to-play service video.
 *
 * Nothing is downloaded until the visitor asks: the preview is a blurred poster
 * with one large play control, and the <video> element is only mounted (and
 * started) after that click. Without a configured source the same control opens
 * the written assessment overview instead of pretending a video exists.
 */
export function ServiceVideo({
  video = serviceVideo,
  variant = "feature",
  whenUnavailable = "overview",
  className,
}: ServiceVideoProps) {
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const startedRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasVideo = Boolean(video.src);

  const start = useCallback(() => {
    if (!hasVideo) {
      setOverviewOpen(true);
      return;
    }
    // Guard against double clicks / repeated initialisation.
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
  }, [hasVideo]);

  // Mounted only after the click, so play() runs inside the user activation.
  const attachVideo = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (!element) return;

    const pauseOthers = () => {
      for (const other of players) if (other !== element && !other.paused) other.pause();
    };
    players.add(element);
    element.addEventListener("play", pauseOthers);
    element.focus({ preventScroll: true });
    element.play().catch(() => {
      // Autoplay refused (e.g. data saver): the native controls stay available.
    });

    return () => {
      players.delete(element);
      element.removeEventListener("play", pauseOthers);
    };
  }, []);

  const expand = useCallback(() => {
    const element = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (!element) return;
    if (element.requestFullscreen) element.requestFullscreen().catch(() => {});
    else element.webkitEnterFullscreen?.(); // iOS Safari
  }, []);

  useEffect(() => {
    if (!overviewOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOverviewOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [overviewOpen]);

  const fade = prefersReducedMotion ? 0 : 0.55;
  const interactive = hasVideo || whenUnavailable === "overview";
  const previewContent = (
    <>
      <motion.span
        className="service-video-poster"
        exit={{ filter: "blur(0px)", scale: 1 }}
        initial={false}
        transition={{ duration: fade, ease: EASE }}
      >
        <Image
          alt=""
          fill
          sizes={
            variant === "compact"
              ? "(max-width: 920px) 100vw, 440px"
              : "(max-width: 980px) 100vw, 960px"
          }
          src={video.poster}
        />
      </motion.span>
      <span aria-hidden="true" className="service-video-scrim" />

      <span aria-hidden="true" className="service-video-play">
        <span className="service-video-play-ring" />
        <Play fill="currentColor" />
      </span>

      <span aria-hidden="true" className="service-video-meta">
        <span className="service-video-kicker">
          {hasVideo ? <Play fill="currentColor" /> : <Clock3 />}
          {video.label}
          {hasVideo ? null : " · coming soon"}
        </span>
        <strong>{video.title}</strong>
      </span>
    </>
  );

  return (
    <>
      <div
        className={`service-video service-video-${variant} ${className ?? ""}`}
        data-state={started ? "playing" : "preview"}
      >
        {started && video.src ? (
          <motion.video
            animate={{ opacity: 1 }}
            className="service-video-media"
            controls
            initial={{ opacity: 0 }}
            playsInline
            poster={video.poster}
            preload="auto"
            ref={attachVideo}
            transition={{ duration: fade, ease: EASE }}
          >
            <source src={video.src} type={video.type} />
            {video.captions ? (
              <track default kind="captions" label="English" src={video.captions} srcLang="en" />
            ) : null}
          </motion.video>
        ) : null}

        {started && video.src ? (
          <button
            aria-label="Expand video to full screen"
            className="service-video-expand"
            onClick={expand}
            type="button"
          >
            <Expand aria-hidden="true" />
          </button>
        ) : null}

        {!started && !interactive ? (
          <div className="service-video-preview is-unavailable">
            {previewContent}
            <span className="sr-only">{`${video.title}: video coming soon.`}</span>
          </div>
        ) : null}

        <AnimatePresence>
          {!started && interactive ? (
            <motion.button
              aria-label={
                hasVideo
                  ? `Play video: ${video.title}`
                  : "Video coming soon. See what the free assessment covers"
              }
              className="service-video-preview"
              exit={{ opacity: 0 }}
              key="preview"
              onClick={start}
              ref={triggerRef}
              transition={{ duration: fade, delay: prefersReducedMotion ? 0 : 0.15, ease: EASE }}
              type="button"
            >
              {previewContent}
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>

      {overviewOpen ? (
        <div
          aria-labelledby={titleId}
          aria-modal="true"
          className="dialog-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOverviewOpen(false);
          }}
          role="dialog"
        >
          <div className="dialog-card">
            <button
              aria-label="Close assessment overview"
              className="dialog-close"
              onClick={() => setOverviewOpen(false)}
              ref={closeRef}
              type="button"
            >
              <X aria-hidden="true" />
            </button>
            <span className="eyebrow">Your first clear step</span>
            <h2 id={titleId}>
              Know what to practise before you practise more.
            </h2>
            <p>
              The trainer-led video will be added after final production approval. The
              free assessment already has one simple job: turn a vague score problem
              into an actionable plan.
            </p>
            <ul className="dialog-list">
              {overviewSteps.map((step) => (
                <li key={step}>
                  <Check aria-hidden="true" />
                  {step}
                </li>
              ))}
            </ul>
            <a
              className="button button-primary"
              href="#assessment-form"
              onClick={() => setOverviewOpen(false)}
            >
              Book my free assessment
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
