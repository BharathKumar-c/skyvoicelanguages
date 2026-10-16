import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, MessageCircleMore, Quote, UsersRound } from "lucide-react";
import Link from "next/link";

import { DrawLine } from "@/components/draw-line";
import { AiraContext, AiraGroundShadow } from "@/components/mascot";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrainerDirectory } from "@/components/trainer-directory";
import { assessmentHref, siteConfig } from "@/config/site";
import {
  aboutIntro,
  achievements,
  differentiators,
  learningEnvironment,
  philosophy,
  purpose,
  successStories,
  trainers,
} from "@/content/about";
import { methodSteps } from "@/content/landing";

export const metadata: Metadata = {
  title: "About Sky Voice Languages",
  description:
    "Who we are and how we coach: diagnosis-first online IELTS preparation for Academic and General Training, in 1-on-1 sessions or groups of 3–5.",
  alternates: { canonical: `${siteConfig.url}/about` },
  openGraph: {
    title: "About Sky Voice Languages",
    description:
      "Diagnosis-first online IELTS coaching: our approach, mission, method, and trainers.",
    url: `${siteConfig.url}/about`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${siteConfig.url}/about#page`,
  name: "About Sky Voice Languages",
  url: `${siteConfig.url}/about`,
  about: { "@id": `${siteConfig.url}/#organization` },
};

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

export default function AboutPage() {
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
              <span className="eyebrow">{aboutIntro.eyebrow}</span>
              <h1 id="about-title">{aboutIntro.title}</h1>
              <p className="page-hero-lede">{aboutIntro.lede}</p>
              <div className="hero-actions">
                <Link className="button button-accent button-large" href={assessmentHref}>
                  Book my free assessment
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="button button-secondary button-large" href="/contact">
                  Contact us
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
              <span className="eyebrow">{philosophy.eyebrow}</span>
              <h2 id="approach-title">{philosophy.title}</h2>
              {philosophy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
            <ul className="audience-grid plain-list approach-list">
              {differentiators.map((item) => (
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
              <span className="eyebrow">What we stand for</span>
              <h2 id="purpose-title">Our mission, vision, and goals.</h2>
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
                <span className="eyebrow">Our teaching methodology</span>
                <h2 id="method-title">Six steps, from first assessment to exam-ready.</h2>
              </div>
              <Link className="text-link" href={assessmentHref}>
                Steps 1 and 2 are free
                <ArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
            <div className="method-path">
              <DrawLine className="method-line" duration={1.2} />
              {methodSteps.map((step) => (
                <div className="method-step" key={step.number}>
                  <div className={`method-marker ${step.free ? "is-free" : ""}`}>
                    <step.icon aria-hidden="true" />
                    {step.free ? <span>Free</span> : null}
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
              <span className="eyebrow">Our trainers</span>
              <h2 id="trainers-title">The people who read every essay you write.</h2>
              <p>
                Qualifications, teaching experience, and a short video introduction for
                every Sky Voice trainer.
              </p>
            </Reveal>
            {trainers.length ? (
              <TrainerDirectory trainers={trainers} />
            ) : (
              <div className="pending-card">
                <UsersRound aria-hidden="true" />
                <div>
                  <strong>Trainer profiles are being finalised.</strong>
                  <p>
                    Each trainer will appear here with a photograph, qualifications, years
                    of teaching, areas of expertise, and a video introduction once Sky
                    Voice has approved the details. Until then, the free assessment is the
                    best way to meet the team.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="section results-section" aria-labelledby="results-title">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">Achievements and student stories</span>
              <h2 id="results-title">Results we can prove, published with consent.</h2>
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
                  <li className="story-card" key={story.name}>
                    <Quote aria-hidden="true" />
                    <p>{story.quote}</p>
                    <span className="story-score">
                      {story.from} → {story.to} · {story.module}
                    </span>
                    <strong>{story.name}</strong>
                  </li>
                ))}
              </ul>
            ) : null}
            {!achievements.length && !successStories.length ? (
              <div className="pending-card">
                <BadgeCheck aria-hidden="true" />
                <div>
                  <strong>Verified results are on their way.</strong>
                  <p>
                    Score reports, achievements, and student stories are published only
                    after they are verified and the student has agreed in writing. We
                    would rather show nothing than show something we cannot prove.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="section" aria-labelledby="environment-title">
          <div className="site-shell feature-split">
            <Reveal className="feature-head">
              <span className="eyebrow">Facilities and learning environment</span>
              <h2 id="environment-title">Everything you need to practise, online.</h2>
              <p>
                No commute and no crowded classroom: live coaching, exam-format practice,
                and personal feedback in one place.
              </p>
            </Reveal>
            <Reveal className="feature-art" delay={0.06}>
              <ArtStage context="about-environment" shadow={160} />
            </Reveal>
            <ul className="feature-body audience-grid">
              {learningEnvironment.map((item) => (
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
              <h2 id="about-cta-title">Start with a free assessment.</h2>
              <p>
                Leave with your current level, your weak modules, and a written roadmap,
                before you pay for anything.
              </p>
            </div>
            <div className="page-cta-actions">
              <Link className="button button-accent button-large" href={assessmentHref}>
                Book my free assessment
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button button-on-dark button-large" href="/contact">
                <MessageCircleMore aria-hidden="true" />
                Ask a question
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
