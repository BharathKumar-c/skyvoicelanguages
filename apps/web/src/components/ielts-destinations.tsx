"use client";

import { BriefcaseBusiness, GraduationCap, Home, MapPin, Plane } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { ieltsPathways, type PathwayId } from "@/content/landing";
import { useI18n } from "@/i18n/client";
import { fadeFirstTransition, usePrefersReducedMotion } from "@/lib/motion";

const icons = { migrate: Home, study: GraduationCap, work: BriefcaseBusiness } as const;

/**
 * "Where IELTS can take you": three pathways as tabs (arrow keys move between
 * them), each revealing its destinations with a staggered entrance. Under
 * reduced motion the cards only fade.
 */
export function IeltsDestinations() {
  const { m } = useI18n();
  const [active, setActive] = useState<PathwayId>("study");
  const reduce = usePrefersReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Ids and country codes from content/landing, wording from the interface text.
  const pathways = useMemo(
    () =>
      ieltsPathways.map((pathway, i) => {
        const text = m.destinations.pathways[i];
        return {
          ...text,
          id: pathway.id,
          destinations: pathway.codes.map((code, j) => ({ code, ...text.destinations[j] })),
        };
      }),
    [m.destinations.pathways],
  );
  const pathway = pathways.find((item) => item.id === active) ?? pathways[0];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + pathways.length) % pathways.length;
    setActive(pathways[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="destinations">
      <div aria-label={m.destinations.tabsLabel} className="destination-tabs" role="tablist">
        {pathways.map((item, index) => {
          const Icon = icons[item.id];
          const selected = item.id === active;
          return (
            <button
              aria-controls={`${baseId}-panel`}
              aria-selected={selected}
              className={selected ? "is-active" : undefined}
              id={`${baseId}-tab-${item.id}`}
              key={item.id}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <Icon aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`${baseId}-tab-${pathway.id}`}
        className="destination-panel"
        id={`${baseId}-panel`}
        role="tabpanel"
      >
        <div className="destination-intro">
          <span className="destination-test">
            <Plane aria-hidden="true" />
            {pathway.test}
          </span>
          <p>{pathway.summary}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.ul
            animate="shown"
            className="destination-grid"
            exit="hidden"
            initial="hidden"
            key={pathway.id}
            variants={{ hidden: {}, shown: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
          >
            {pathway.destinations.map((destination) => (
              <motion.li
                className="destination-card"
                key={destination.code}
                transition={fadeFirstTransition(reduce, { duration: 0.35 }, ["y"])}
                variants={{ hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0 } }}
              >
                <span aria-hidden="true" className="destination-code">
                  {destination.code}
                </span>
                <div>
                  <strong>{destination.country}</strong>
                  <span>
                    <MapPin aria-hidden="true" />
                    {destination.note}
                  </span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
