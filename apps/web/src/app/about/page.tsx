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
import {
  aboutIntro,
  differentiators,
  learningEnvironment,
  philosophy,
  type Trainer,
} from "@/content/about";
import { methodSteps } from "@/content/landing";
import { siteUrl } from "@/lib/settings/format";
import type { SiteSettings } from "@/lib/settings/schema";
import { getSettings } from "@/lib/settings/store";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = settings.company.name;
  return {
    title: `About ${name}`,
    description:
      "Who we are and how we coach: diagnosis-first online IELTS preparation for Academic and General Training, in 1-on-1 sessions or groups of 3–5.",
    alternates: { canonical: siteUrl(settings, "/about") },
    openGraph: {
      title: `About ${name}`,
      description:
        "Diagnosis-first online IELTS coaching: our approach, mission, method, and trainers.",
      url: siteUrl(settings, "/about"),
    },
  };
}

/** Published trainers only, shaped for the directory component. */
function publishedTrainers(settings: SiteSettings): Trainer[] {
  return settings.team.trainers
    .filter((trainer) => trainer.published)
    .map((trainer) => ({
      achievements: trainer.achievements,
      bio: trainer.bio,
      designation: trainer.designation,
      experienceYears: trainer.experienceYears ? Number(trainer.experienceYears) : null,
      expertise: trainer.expertise,
      id: trainer.id,
      name: trainer.name,
      photo: trainer.photoUrl ? { alt: `Portrait of ${trainer.name}`, src: trainer.photoUrl } : null,
      qualifications: trainer.qualifications,
      video: trainer.videoUrl
        ? {
            captions: null,
            label: "Introduction",
            poster: "/assets/generated/images/service-video-poster-feature.webp",
            src: trainer.videoUrl,
            title: `Meet ${trainer.name}`,
            type: trainer.videoUrl.endsWith(".webm") ? "video/webm" : "video/mp4",
          }
        : null,
    }));
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
  const settings = await getSettings();
  const { about } = settings.content;
  const trainers = publishedTrainers(settings);
  // Public only once verified / consented in Website Settings.
  const achievements = settings.results.stats.filter((stat) => stat.verified);
  const successStories = settings.results.testimonials.filter((story) => story.published && story.consent);
  const purpose = [
    { label: "Mission", statement: about.mission },
    { label: "Vision", statement: about.vision },
    { label: "Goals", statement: about.goals },
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
              <span className="eyebrow">{aboutIntro.eyebrow}</span>
              <h1 id="about-title">{about.title}</h1>
              <p className="page-hero-lede">{about.lede}</p>
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
