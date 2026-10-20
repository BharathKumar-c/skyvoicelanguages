import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, MessageCircleMore, Quote, UsersRound } from "lucide-react";
import Link from "next/link";

import { DrawLine } from "@/components/draw-line";
import { AiraContext, AiraGroundShadow } from "@/components/mascot";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrainerDirectory } from "@/components/trainer-directory";
import { assessmentHref } from "@/config/site";
import { differentiators, learningEnvironment } from "@/content/about";
import { methodSteps } from "@/content/landing";
import { format } from "@/i18n/merge";
import { getMessages } from "@/i18n/server";
import { siteUrl } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";
import { publishedTrainers } from "@/lib/settings/trainers";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const title = format(m.about.meta.title, { company: settings.company.name });
  return {
    title,
    description: m.about.meta.description,
    alternates: { canonical: siteUrl(settings, "/about") },
    openGraph: { title, description: m.about.meta.ogDescription, url: siteUrl(settings, "/about") },
  };
}

function ArtStage({ context, shadow }: { context: "about-hero" | "about-environment"; shadow: number }) {
  return (
    <div className="feature-art-stage">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
      <img
        alt=""
        aria-hidden="true"
        className="feature-art-orbit"
        height={560}
        src="/assets/generated/motion-graphics/hero-aira-orbit-stage-static.svg"
        width={480}
      />
      <div className="aira-figure">
        <AiraContext context={context} decorative eager={context === "about-hero"} />
        <AiraGroundShadow width={shadow} />
      </div>
    </div>
  );
}

export default async function AboutPage() {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const t = m.about;
  const { about } = settings.content;
  const trainers = publishedTrainers(settings, m.client.trainer);
  // Public only once verified / consented in Website Settings.
  const achievements = settings.results.stats.filter((stat) => stat.verified);
  const successStories = settings.results.testimonials.filter((story) => story.published && story.consent);
  const purpose = [
    { label: t.purpose.mission, statement: about.mission },
    { label: t.purpose.vision, statement: about.vision },
    { label: t.purpose.goals, statement: about.goals },
  ];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": siteUrl(settings, "/about#page"),
    name: `About ${settings.company.name}`,
    url: siteUrl(settings, "/about"),
    about: { "@id": siteUrl(settings, "/#organization") },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <noscript>
        <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
      </noscript>
      <SiteHeader />
      <main className="inner-page" id="main-content">
        <section className="page-hero" aria-labelledby="about-title">
          <div className="site-shell page-hero-grid">
            <div className="page-hero-copy hero-enter">
              <span className="eyebrow">{t.eyebrow}</span>
              <h1 id="about-title">{about.title}</h1>
              <p className="page-hero-lede">{about.lede}</p>
              <div className="hero-actions">
                <Link className="button button-accent button-large" href={assessmentHref}>
                  {m.shared.bookAssessment}
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="button button-secondary button-large" href="/contact">
                  {m.shared.contactUs}
                </Link>
              </div>
            </div>
            <div className="page-hero-art hero-enter hero-enter-2">
              <ArtStage context="about-hero" shadow={170} />
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="approach-title">
          <div className="site-shell approach-grid">
            <Reveal className="approach-copy">
              <span className="eyebrow">{t.philosophy.eyebrow}</span>
              <h2 id="approach-title">{t.philosophy.title}</h2>
              {t.philosophy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
            <ul className="audience-grid plain-list approach-list">
              {differentiators(t).map((item) => (
                <li className="audience-card" key={item.title}>
                  <item.icon aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section purpose-section" aria-labelledby="purpose-title">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{t.purpose.eyebrow}</span>
              <h2 id="purpose-title">{t.purpose.title}</h2>
            </Reveal>
            <div className="purpose-grid">
              {purpose.map((item) => (
                <article className="purpose-card" key={item.label}>
                  <span className="purpose-label">{item.label}</span>
                  <p>{item.statement}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section method-section" aria-labelledby="method-title">
          <div className="site-shell">
            <Reveal className="section-heading method-heading">
              <div>
                <span className="eyebrow">{t.method.eyebrow}</span>
                <h2 id="method-title">{t.method.title}</h2>
              </div>
              <Link className="text-link" href={assessmentHref}>
                {t.method.link}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
            <div className="method-path">
              <DrawLine className="method-line" duration={1.2} />
              {methodSteps(m.landing).map((step) => (
                <div className="method-step" key={step.number}>
                  <div className={`method-marker ${step.free ? "is-free" : ""}`}>
                    <step.icon aria-hidden="true" />
                    {step.free ? <span>{m.shared.free}</span> : null}
                  </div>
                  <span className="step-number">{step.number}</span>
                  <h3>{step.label}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section trainers-section" id="trainers" aria-labelledby="trainers-title">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{t.trainers.eyebrow}</span>
              <h2 id="trainers-title">{t.trainers.title}</h2>
              <p>{t.trainers.body}</p>
            </Reveal>
            {trainers.length ? (
              <TrainerDirectory trainers={trainers} />
            ) : (
              <div className="pending-card">
                <UsersRound aria-hidden="true" />
                <div>
                  <strong>{t.trainers.pendingTitle}</strong>
                  <p>{t.trainers.pendingBody}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="section results-section" aria-labelledby="results-title">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{t.results.eyebrow}</span>
              <h2 id="results-title">{t.results.title}</h2>
            </Reveal>
            {achievements.length ? (
              <dl className="achievement-grid">
                {achievements.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {successStories.length ? (
              <ul className="story-grid">
                {successStories.map((story) => (
                  <li className="story-card" key={`${story.name}-${story.quote.slice(0, 20)}`}>
                    <Quote aria-hidden="true" />
                    <p>{story.quote}</p>
                    {story.from || story.to || story.module ? (
                      <span className="story-score">
                        {[story.from && story.to ? `${story.from} → ${story.to}` : story.to || story.from, story.module]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    ) : null}
                    {story.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- admin-supplied path or URL
                      <img alt="" className="story-photo" height={48} src={story.photoUrl} width={48} />
                    ) : null}
                    <strong>{story.name}</strong>
                  </li>
                ))}
              </ul>
            ) : null}
            {!achievements.length && !successStories.length ? (
              <div className="pending-card">
                <BadgeCheck aria-hidden="true" />
                <div>
                  <strong>{t.results.pendingTitle}</strong>
                  <p>{t.results.pendingBody}</p>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="section" aria-labelledby="environment-title">
          <div className="site-shell feature-split">
            <Reveal className="feature-head">
              <span className="eyebrow">{t.environment.eyebrow}</span>
              <h2 id="environment-title">{t.environment.title}</h2>
              <p>{t.environment.body}</p>
            </Reveal>
            <Reveal className="feature-art" delay={0.06}>
              <ArtStage context="about-environment" shadow={160} />
            </Reveal>
            <ul className="feature-body audience-grid">
              {learningEnvironment(t).map((item) => (
                <li className="audience-card" key={item.title}>
                  <item.icon aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="page-cta" aria-labelledby="about-cta-title">
          <div className="site-shell page-cta-inner">
            <div>
              <h2 id="about-cta-title">{t.cta.title}</h2>
              <p>{t.cta.body}</p>
            </div>
            <div className="page-cta-actions">
              <Link className="button button-accent button-large" href={assessmentHref}>
                {m.shared.bookAssessment}
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button button-on-dark button-large" href="/contact">
                <MessageCircleMore aria-hidden="true" />
                {m.shared.askQuestion}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
