"use client";

import { ArrowLeft, ArrowRight, MapPin, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/merge";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { SiteSettings } from "@/lib/settings/schema";

export type Story = SiteSettings["results"]["testimonials"][number];

function initials(name: string) {
  return name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function StoryCard({ story, index }: { story: Story; index: number }) {
  const t = useI18n().m.stories;
  const score = story.from && story.to ? `${story.from} → ${story.to}` : story.to || story.from;
  const headingId = `story-${index}-name`;
  return (
    <li aria-labelledby={headingId} className="story-slide">
      <div className="story-avatar">
        {story.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-supplied path or URL, shown with consent
          <img alt="" height={88} src={story.photoUrl} width={88} />
        ) : (
          <span aria-hidden="true">{initials(story.name)}</span>
        )}
      </div>
      <h3 id={headingId}>{story.name}</h3>
      {story.detail ? (
        <p className="story-detail">
          <MapPin aria-hidden="true" />
          {story.detail}
        </p>
      ) : null}
      {score || story.module ? (
        <p className="story-badges">
          {score ? <span className="story-band">{score}</span> : null}
          {story.module ? <span className="story-module">{story.module}</span> : null}
        </p>
      ) : null}
      {story.outcome ? (
        <p className="story-outcome">
          <Trophy aria-hidden="true" />
          {story.outcome}
        </p>
      ) : null}
      <div aria-label={format(t.ownWords, { name: story.name })} className="story-chat" role="group" tabIndex={0}>
        {story.journey.length ? (
          story.journey.map((item) => (
            <div className="story-exchange" key={item.question}>
              <p className="chat-question">{item.question}</p>
              <p className="chat-answer">{item.answer}</p>
            </div>
          ))
        ) : (
          <p className="chat-answer chat-quote">{story.quote}</p>
        )}
      </div>
    </li>
  );
}

/**
 * Student Success Stories: a swipeable row of story cards (scroll-snap), with
 * previous/next buttons. Every story here is published with recorded consent.
 */
export function SuccessStories({ stories }: { stories: Story[] }) {
  const t = useI18n().m.stories;
  const track = useRef<HTMLUListElement>(null);
  const reduce = usePrefersReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      start: el.scrollLeft <= 4,
    });
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".story-slide");
    if (!el || !card) return;
    el.scrollBy({ behavior: reduce ? "auto" : "smooth", left: direction * (card.offsetWidth + 20) });
  };

  const scrollable = !(edges.start && edges.end);

  return (
    <div className="stories-carousel">
      <ul aria-label={t.listLabel} className="story-track" ref={track}>
        {stories.map((story, index) => (
          <StoryCard index={index} key={`${story.name}-${index}`} story={story} />
        ))}
      </ul>
      {scrollable ? (
        <div className="story-controls">
          <button aria-label={t.previous} disabled={edges.start} onClick={() => scrollByCard(-1)} type="button">
            <ArrowLeft aria-hidden="true" />
          </button>
          <button aria-label={t.next} disabled={edges.end} onClick={() => scrollByCard(1)} type="button">
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
