import { Award, BadgeCheck, Globe2, Quote } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { format } from "@/i18n/merge";
import { getMessages } from "@/i18n/server";
import type { SiteSettings } from "@/lib/settings/schema";
import { publicProof } from "@/lib/settings/trainers";

/**
 * Awards, countries, statistics, and testimonials, each shown only once it is
 * verified/consented in Website Settings. Renders nothing while all are empty,
 * unless `pendingNote` is set.
 */
export async function ProofSection({
  settings,
  id,
  eyebrow,
  title,
  pendingNote = false,
}: {
  settings: SiteSettings;
  id: string;
  eyebrow: string;
  title: string;
  pendingNote?: boolean;
}) {
  const { awards, countries, stats, testimonials } = publicProof(settings);
  const t = (await getMessages()).shared.proof;
  const empty = !awards.length && !countries.length && !stats.length && !testimonials.length;
  if (empty && !pendingNote) return null;

  return (
    <section aria-labelledby={`${id}-title`} className="section results-section" id={id}>
      <div className="site-shell">
        <Reveal className="section-heading centered-heading">
          <span className="eyebrow">{eyebrow}</span>
          <h2 id={`${id}-title`}>{title}</h2>
        </Reveal>

        {awards.length ? (
          <ul aria-label={t.awardsLabel} className="award-grid">
            {awards.map((award) => (
              <li className="award-card" key={`${award.title}-${award.year}`}>
                <Award aria-hidden="true" />
                <div>
                  <strong>{award.title}</strong>
                  <span>{[award.issuer, award.year].filter(Boolean).join(" · ")}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {stats.length ? (
          <dl className="achievement-grid">
            {stats.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {countries.length ? (
          <div className="country-block">
            <p className="country-heading">
              <Globe2 aria-hidden="true" />
              {countries.length === 1 ? t.studentsFromOne : format(t.studentsFrom, { count: countries.length })}
            </p>
            <ul aria-label={t.countriesLabel} className="country-list">
              {countries.map((country) => (
                <li key={country}>{country}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {testimonials.length ? (
          <ul className="story-grid">
            {testimonials.map((story, index) => (
              <li className="story-card" key={`${story.name}-${index}`}>
                <Quote aria-hidden="true" />
                <p>{story.quote}</p>
                {story.from || story.to || story.module ? (
                  <span className="story-score">
                    {[story.from && story.to ? `${story.from} → ${story.to}` : story.to || story.from, story.module]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                ) : null}
                <strong>{story.name}</strong>
              </li>
            ))}
          </ul>
        ) : null}

        {empty ? (
          <div className="pending-card">
            <BadgeCheck aria-hidden="true" />
            <div>
              <strong>{t.pendingTitle}</strong>
              <p>{t.pendingBody}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
