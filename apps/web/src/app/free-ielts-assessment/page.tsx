import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  GraduationCap,
  Clock3,
  Headphones,
  Laptop2,
  MessageCircleMore,
  MessagesSquare,
  MousePointerClick,
  Plane,
  Route,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TimerReset,
  TrendingUp,
  Users,
  Video,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";

import { AiraContext, AiraGroundShadow, SkillSignal } from "@/components/mascot";
import { AnimatedArt } from "@/components/animated-art";
import type { SkillSignalModule } from "@/components/mascot";
import { BrandLogo } from "@/components/brand-logo";
import { DrawLine } from "@/components/draw-line";
import { FaqList } from "@/components/faq-list";
import { InteractiveWaves } from "@/components/interactive-waves";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ServiceVideo } from "@/components/service-video";
import { landingVideos } from "@/config/media";
import { siteConfig } from "@/config/site";
import { audiences, methodSteps, modules, scoreGaps, trustPoints } from "@/content/landing";
import { brandLogos, formatFee, siteUrl } from "@/lib/settings/format";
import type { SiteSettings } from "@/lib/settings/schema";
import { getSettings } from "@/lib/settings/store";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const url = siteUrl(settings, siteConfig.campaignPath);
  return {
    title: "Online IELTS Coaching & Free Assessment",
    description:
      "Find the exact IELTS skills holding back your score. Book a free online assessment for a personalised Academic or General Training roadmap.",
    alternates: { canonical: url },
    openGraph: {
      title: "Know what is holding back your IELTS score",
      description:
        "Free IELTS assessment, a clear preparation roadmap, and personalised online coaching for Academic and General Training.",
      url,
    },
  };
}

const structuredDataFor = (settings: SiteSettings) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": siteUrl(settings, "/#organization"),
      name: settings.company.name,
      url: settings.company.domain,
      logo: siteUrl(settings, "/brand/skyvoice-icon.svg"),
      description: settings.company.description,
      ...(settings.company.socialLinks.length
        ? { sameAs: settings.company.socialLinks.map((link) => link.url) }
        : {}),
    },
    {
      "@type": "Service",
      "@id": siteUrl(settings, `${siteConfig.campaignPath}#service`),
      name: "Online IELTS Coaching and Assessment",
      provider: { "@id": siteUrl(settings, "/#organization") },
      serviceType: "IELTS coaching",
      areaServed: settings.company.serviceArea || "Online",
      description:
        "Personalised online IELTS coaching for Academic and General Training, beginning with a free diagnostic assessment.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free IELTS assessment and preparation roadmap",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: settings.content.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
});

export default async function FreeIeltsAssessmentPage() {
  const settings = await getSettings();
  const { courses, content } = settings;
  const { hero } = content;
  const videos = landingVideos(settings);
  // Underline the configured words only when they end the second line.
  const underline =
    hero.titleUnderline && hero.titleLine2.endsWith(hero.titleUnderline) ? hero.titleUnderline : "";
  const line2Lead = underline ? hero.titleLine2.slice(0, -underline.length) : hero.titleLine2;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredDataFor(settings)).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <noscript>
        {/* Without JavaScript nothing reveals or toggles: show it all. */}
        <style>{"[data-reveal],.header-cta,.mobile-cta-bar{opacity:1!important;transform:none!important;visibility:visible!important;pointer-events:auto!important}"}</style>
      </noscript>
      <SiteHeader />
      <main id="main-content">
        <section className="hero section" id="top">
          <InteractiveWaves band={0.56} bandCompact={0.3} fadeLeft />
          <div className="site-shell hero-grid">
            <div className="hero-left">
              <div className="hero-content">
                <div className="hero-enter">
                  <div className="hero-eyebrow-row">
                    <span className="eyebrow">
                      <Sparkles aria-hidden="true" />
                      {hero.eyebrow}
                    </span>
                    <span className="availability-dot">Academic + General</span>
                  </div>
                  <h1>
                    {hero.titleLine1}
                    {hero.titleLine2 ? (
                      <span>
                        {" "}
                        {line2Lead}
                        {underline ? <span className="hero-underline">{underline}</span> : null}
                      </span>
                    ) : null}
                  </h1>
                  <p className="hero-lede">{hero.lede}</p>
                  <div className="hero-actions">
                    <Link className="button button-accent button-large" href="#assessment-form">
                      {hero.primaryCtaLabel}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                    <Link className="button button-secondary button-large" href={hero.secondaryCtaHref}>
                      {hero.secondaryCtaLabel}
                    </Link>
                  </div>
                  {hero.reassurance ? (
                    <p className="hero-reassurance">
                      <ShieldCheck aria-hidden="true" />
                      {hero.reassurance}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="hero-mascot-wrap hero-enter hero-enter-2">
                <div className="hero-aira-stage">
                  <AnimatedArt
                    className="hero-aira-orbit"
                    height={560}
                    src="/assets/generated/motion-graphics/hero-aira-orbit-stage.svg"
                    staticSrc="/assets/generated/motion-graphics/hero-aira-orbit-stage-static.svg"
                    width={480}
                  />
                  <div className="aira-figure">
                    <AiraContext
                      context="hero-speaking"
                      eager
                      size="xl"
                      aria-label="Aira, your SkyVoice IELTS guide, presents your next score move"
                    />
                    <AiraGroundShadow width={190} />
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-video hero-enter hero-enter-2">
                <ServiceVideo variant="compact" video={videos.hero} />
              </div>
              <div className="hero-form-wrap hero-enter hero-enter-3">
                <div className="hero-form-accent" aria-hidden="true">
                  <span>Start here</span>
                  <ArrowRight />
                </div>
                <LeadForm assessmentDuration={courses.assessmentDuration} idPrefix="assessment" />
              </div>
            </div>
          </div>

          <div className="site-shell trust-strip" aria-label="Course highlights">
            {trustPoints.map((item, index) => (
              <div className="trust-item" key={item.value}>
                <span className="trust-icon" aria-hidden="true">
                  {index === 0 ? <BadgeCheck /> : null}
                  {index === 1 ? <BookOpenCheck /> : null}
                  {index === 2 ? <Target /> : null}
                  {index === 3 ? <Laptop2 /> : null}
                </span>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="video-title" className="section video-section" id="video">
          <div className="site-shell video-shell">
            <Reveal className="section-heading centered-heading video-heading">
              <span className="eyebrow">Meet Sky Voice</span>
              <h2 id="video-title">See how one assessment turns into a clear plan.</h2>
              <p>
                A short introduction to the free assessment, the personalised roadmap,
                and how coaching works week to week.
              </p>
            </Reveal>
            <Reveal className="video-stage" delay={0.06}>
              <ServiceVideo video={videos.service} />
            </Reveal>
            <div className="video-points">
              <span>
                <SearchCheck aria-hidden="true" /> Find your current level
              </span>
              <span>
                <Target aria-hidden="true" /> Spot the module holding you back
              </span>
              <span>
                <Route aria-hidden="true" /> Leave with a written roadmap
              </span>
            </div>
          </div>
        </section>

        <section className="section transformation" id="results">
          <div className="site-shell split-layout">
            <Reveal className="section-copy">
              <span className="eyebrow">A clearer way forward</span>
              <h2>
                From “I keep practising” to
                <span> “I know what to fix.”</span>
              </h2>
              <p>
                More mock tests do not automatically create progress. A useful plan
                connects one specific score gap to one specific correction—then gives
                you a chance to apply it again.
              </p>
              <ul className="check-list">
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Start from your actual level
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Prioritise the modules that matter most
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Build toward a realistic target and timeline
                </li>
              </ul>
              <p className="proof-note">
                Verified student scorecards will be published here only after consent.
              </p>
            </Reveal>

            <Reveal className="score-journey" delay={0.08}>
              <div className="score-card score-card-before">
                <span>Before</span>
                <strong>6.0</strong>
                <small>Practising, but unsure why the score is not moving</small>
              </div>
              <div className="score-route" aria-hidden="true">
                <DrawLine className="route-line" delay={0.35} />
                <span>
                  <Route />
                </span>
                <b>Personalised roadmap</b>
              </div>
              <div className="score-card score-card-after">
                <span>Target</span>
                <strong>7.0</strong>
                <small>A clear plan for the next correction and practice cycle</small>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section section-soft" id="why-stuck">
          <div className="site-shell feature-split">
            <Reveal className="feature-head">
              <span className="eyebrow">Why scores get stuck</span>
              <h2>Practice tells you the score. Diagnosis tells you what to change.</h2>
              <p>
                To move a band, you need four answers that another random mock rarely
                gives you.
              </p>
            </Reveal>
            <Reveal className="feature-art" delay={0.06}>
              <div className="feature-art-stage">
                {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
                <img
                  alt=""
                  aria-hidden="true"
                  className="feature-art-orbit"
                  height={560}
                  loading="lazy"
                  src="/assets/generated/motion-graphics/hero-aira-orbit-stage-static.svg"
                  width={480}
                />
                <div className="aira-figure">
                  <AiraContext context="why-stuck" decorative />
                  <AiraGroundShadow width={170} />
                </div>
              </div>
            </Reveal>
            <div className="feature-body gap-grid">
              {scoreGaps.map((gap, index) => (
                <div className="gap-card" key={gap.title}>
                  <span className="number-chip">0{index + 1}</span>
                  <gap.icon aria-hidden="true" />
                  <h3>{gap.title}</h3>
                  <p>{gap.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section method-section" id="method">
          <div className="site-shell">
            <Reveal className="section-heading method-heading">
              <div>
                <span className="eyebrow">The Sky Voice method</span>
                <h2>Your preparation should be personal. Your weaknesses already are.</h2>
              </div>
              <Link className="text-link" href="#assessment-form">
                Start with steps 1 and 2—free
                <ChevronRight aria-hidden="true" />
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

        <section className="section modules-section" id="modules">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">Four modules · one connected plan</span>
              <h2>Train each skill the way the examiner sees it.</h2>
              <p>
                Listening, Reading, Writing, and Speaking need different techniques—and
                one roadmap that keeps them moving together.
              </p>
            </Reveal>

            <Reveal className="module-tableau" delay={0.04}>
              <div className="module-tableau-aira">
                <div className="aira-figure">
                  <AiraContext
                    context="feedback"
                    size="xl"
                    aria-label="Aira connects feedback across all four IELTS skills"
                  />
                  <AiraGroundShadow tone="light" width={190} />
                </div>
              </div>
              <div className="module-tableau-copy">
                <strong>One guide. Four connected skill signals.</strong>
                <p>Aira turns feedback from each module into one clear next step.</p>
                <div className="module-tableau-signals" aria-hidden="true">
                  {(["listening", "reading", "writing", "speaking"] as const).map(
                    (skill) => (
                      <SkillSignal
                        decorative
                        key={skill}
                        module={skill}
                        size={76}
                        state="idle"
                      />
                    ),
                  )}
                </div>
              </div>
            </Reveal>

            <div aria-label="The four IELTS modules" className="module-grid" role="region" tabIndex={0}>
              {modules.map((module, index) => (
                <div
                  className={`module-card module-card-${index + 1}`}
                  key={module.name}
                >
                  <div className="module-signal" aria-hidden="true">
                    <SkillSignal
                      className="module-signal-image"
                      module={module.name.toLowerCase() as SkillSignalModule}
                      state="active"
                      size={152}
                      decorative
                    />
                    <SkillSignal
                      className="module-signal-success"
                      module={module.name.toLowerCase() as SkillSignalModule}
                      state="success"
                      size={152}
                      decorative
                    />
                  </div>
                  <span className="module-kicker">{module.kicker}</span>
                  <h3>{module.name}</h3>
                  <p>{module.description}</p>
                  <ul>
                    {module.stats.map((stat) => (
                      <li key={stat}>
                        <CircleDot aria-hidden="true" />
                        {stat}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="test-type-banner">
              <div>
                <span className="type-icon">
                  <GraduationCapIcon />
                </span>
                <div>
                  <strong>IELTS Academic</strong>
                  <p>University admission and professional registration.</p>
                </div>
              </div>
              <div>
                <span className="type-icon">
                  <PlaneIcon />
                </span>
                <div>
                  <strong>IELTS General Training</strong>
                  <p>Work, migration, and permanent-residency pathways.</p>
                </div>
              </div>
              <Link href="#assessment-form">Not sure? We’ll help you choose.</Link>
            </div>
          </div>
        </section>

        <section className="section portal-section" id="portal">
          <div className="site-shell portal-grid">
            <Reveal className="portal-copy">
              <span className="eyebrow">Practice portal</span>
              <h2>Practise inside the format. Get help at the moment you need it.</h2>
              <p>
                Classes teach the technique. The portal helps you make it automatic in
                an exam-like computer-delivered environment.
              </p>
              <div className="portal-features">
                {courses.portalPracticeSets ? (
                  <div>
                    <strong>{courses.portalPracticeSets}</strong>
                    <span>practice sets</span>
                  </div>
                ) : null}
                <div>
                  <strong>4</strong>
                  <span>IELTS modules</span>
                </div>
                <div>
                  <strong>A + G</strong>
                  <span>test types</span>
                </div>
              </div>
              <p className="inline-note">
                <Clock3 aria-hidden="true" />
                {courses.portalAccessDuration
                  ? `Portal access: ${courses.portalAccessDuration}.`
                  : "Access duration will be displayed after final client confirmation."}
              </p>
            </Reveal>

            <div className="portal-stage">
              <Reveal
                ariaLabel="IELTS practice portal concept preview"
                className="portal-preview"
                delay={0.08}
                role="region"
                tabIndex={0}
              >
                <div className="portal-window-bar">
                  <span />
                  <span />
                  <span />
                  <small>Concept preview · final screenshots pending</small>
                </div>
                <div className="portal-body">
                  <aside>
                    <BrandLogo src={brandLogos(settings).default} />
                    <nav aria-label="Concept portal navigation">
                      <span className="active">
                        <Headphones aria-hidden="true" /> Practice
                      </span>
                      <span>
                        <Target aria-hidden="true" /> Progress
                      </span>
                      <span>
                        <MessageCircleMore aria-hidden="true" /> Tutor
                      </span>
                    </nav>
                  </aside>
                  <div className="portal-question">
                    <div className="portal-topline">
                      <span>Listening · Set 12</span>
                      <b>
                        <TimerReset aria-hidden="true" /> 24:18
                      </b>
                    </div>
                    <div className="audio-wave" aria-hidden="true">
                      {[18, 32, 44, 24, 52, 38, 64, 30, 46, 28, 58, 36].map((height, i) => (
                        <span key={`${height}-${i}`} style={{ height }} />
                      ))}
                    </div>
                    <p>Choose the answer that best matches the speaker’s purpose.</p>
                    <div className="portal-options">
                      <span>A · To compare two study plans</span>
                      <span className="selected">B · To explain a change in schedule</span>
                      <span>C · To recommend a preparation book</span>
                    </div>
                    <div className="portal-progress">
                      <span style={{ width: "62%" }} />
                    </div>
                  </div>
                </div>
              </Reveal>
              <div aria-hidden="true" className="portal-aira">
                <div className="aira-figure">
                  <AiraContext context="portal" decorative />
                  <AiraGroundShadow width={130} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section audience-section" id="audience">
          <div className="site-shell feature-split">
            <Reveal className="feature-head">
              <span className="eyebrow">Built around real life</span>
              <h2>For people preparing with a deadline, a job, or a second attempt.</h2>
            </Reveal>
            <Reveal className="feature-art" delay={0.06}>
              <div className="feature-art-stage">
                {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
                <img
                  alt=""
                  aria-hidden="true"
                  className="feature-art-orbit"
                  height={560}
                  loading="lazy"
                  src="/assets/generated/motion-graphics/hero-aira-orbit-stage-static.svg"
                  width={480}
                />
                <div className="aira-figure">
                  <AiraContext context="audience" decorative />
                  <AiraGroundShadow width={160} />
                </div>
              </div>
            </Reveal>
            <div className="feature-body audience-grid">
              {audiences.map((audience) => (
                <div className="audience-card" key={audience.title}>
                  <audience.icon aria-hidden="true" />
                  <div>
                    <h3>{audience.title}</h3>
                    <p>{audience.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="feature-foot not-for-card">
              <span>Probably not for you if…</span>
              <p>
                You only want last-minute exam tips at 7.5+, or the lowest-cost
                40-student lecture batch. Sky Voice is built around small groups and
                personalised 1-on-1 attention.
              </p>
            </div>
          </div>
        </section>

        <section className="section fees-section" id="fees">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">Clear formats · transparent fees</span>
              <h2>Two ways to train. One personalised method.</h2>
              {courses.feeNote ? <p>{courses.feeNote}</p> : null}
            </Reveal>
            <div className="pricing-grid">
              {courses.plans.map((plan) => (
                <div
                  className={`pricing-card ${plan.featured ? "is-featured" : ""}`}
                  key={plan.name}
                >
                  {plan.featured ? <span className="popular-badge">Most focused</span> : null}
                  <div className="pricing-title">
                    <span>
                      {plan.featured ? <MessagesSquare aria-hidden="true" /> : <Users aria-hidden="true" />}
                    </span>
                    <div>
                      <h3>{plan.name}</h3>
                      <p>{plan.size}</p>
                    </div>
                  </div>
                  <dl className="price-list">
                    <div>
                      <dt>IELTS Academic</dt>
                      <dd>{formatFee(plan.academicFee) ?? "Fee on request"}</dd>
                    </div>
                    <div>
                      <dt>IELTS General Training</dt>
                      <dd>{formatFee(plan.generalFee) ?? "Fee on request"}</dd>
                    </div>
                  </dl>
                  <ul className="plan-features">
                    {plan.description ? (
                      <li>
                        <Check aria-hidden="true" /> {plan.description}
                      </li>
                    ) : null}
                    {plan.schedule ? (
                      <li>
                        <Check aria-hidden="true" /> {plan.schedule}
                      </li>
                    ) : null}
                    {plan.duration ? (
                      <li>
                        <Check aria-hidden="true" /> {plan.duration}
                      </li>
                    ) : null}
                    <li>
                      <Check aria-hidden="true" /> Writing and Speaking feedback
                    </li>
                  </ul>
                  <Link
                    className={`button ${plan.featured ? "button-accent" : "button-secondary"}`}
                    href="#assessment-form"
                  >
                    Find my best format
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
            <div className="price-note">
              <WandSparkles aria-hidden="true" />
              <div>
                <strong>Not sure which format fits?</strong>
                <p>Your free assessment ends with a format recommendation—before you pay.</p>
                {courses.installmentInfo ? (
                  <p className="price-installment">{courses.installmentInfo}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="section proof-section">
          <div className="site-shell proof-grid">
            <Reveal className="proof-visual">
              <div className="proof-figure">
                {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG illustration */}
                <img
                  alt=""
                  aria-hidden="true"
                  className="proof-illustration"
                  decoding="async"
                  height={460}
                  loading="lazy"
                  src="/assets/generated/illustrations/proof-evidence-chain.svg"
                  width={500}
                />
              </div>
              <p className="proof-caption">
                <span className="proof-caption-icon">
                  <TrendingUp aria-hidden="true" />
                </span>
                <strong>Progress you can explain</strong>
                Not a mystery score. A visible chain from feedback to correction.
              </p>
              <div className="proof-float proof-float-one">
                <CheckCircle2 aria-hidden="true" />
                Task 2 structure
              </div>
              <div className="proof-float proof-float-two">
                <CheckCircle2 aria-hidden="true" />
                Reading timing
              </div>
              <div className="proof-float proof-float-three">
                <CheckCircle2 aria-hidden="true" />
                Speaking depth
              </div>
            </Reveal>
            <Reveal className="section-copy" delay={0.08}>
              <span className="eyebrow">Proof, not promises</span>
              <h2>Every claim should be traceable to real student work.</h2>
              <p>
                Sky Voice will publish score reports, verified reviews, and student
                stories only with evidence and consent. Until then, the method—not an
                invented testimonial—does the talking.
              </p>
              <div className="proof-standards">
                <div>
                  <BadgeCheck aria-hidden="true" />
                  <span>
                    <strong>Real score reports</strong>
                    Published after verification
                  </span>
                </div>
                <div>
                  <Video aria-hidden="true" />
                  <span>
                    <strong>Student stories</strong>
                    Shared only with permission
                  </span>
                </div>
                <div>
                  <Star aria-hidden="true" />
                  <span>
                    <strong>Live reviews</strong>
                    Connected to a verified source
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="site-shell faq-grid">
            <Reveal className="faq-intro">
              <span className="eyebrow">Questions before you book</span>
              <h2>Clarity should start before the assessment.</h2>
              <p>
                These answers cover the decisions we can make honestly today. Course
                access, instalment options, and other policies will appear only after
                final confirmation.
              </p>
              <Link className="button button-secondary" href="#final-assessment">
                I’m ready to start
                <ArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
            <Reveal delay={0.08}>
              <FaqList items={content.faqs} />
            </Reveal>
          </div>
        </section>

        <section className="section final-cta" id="final-assessment">
          <InteractiveWaves band={0.84} tone="dark" />
          <div aria-hidden="true" className="final-orbit final-orbit-one" />
          <div aria-hidden="true" className="final-orbit final-orbit-two" />
          <div className="site-shell final-grid">
            <Reveal className="final-copy">
              <span className="eyebrow eyebrow-on-dark">Your next step is simple</span>
              <h2>Don’t prepare blindly. Know where you stand.</h2>
              <p>
                Book your free IELTS assessment and leave with your current level, weak
                modules, and a clear preparation roadmap.
              </p>
              <ol className="next-steps">
                <li>
                  <span>1</span>
                  <div>
                    <strong>Share five quick details</strong>
                    <p>Tell us your test type, city, and target.</p>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <strong>Fix an online assessment slot</strong>
                    <p>The team follows up on WhatsApp to arrange the time.</p>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>Receive your roadmap</strong>
                    <p>Know the weak modules and the best preparation format.</p>
                  </div>
                </li>
              </ol>
            </Reveal>
            <Reveal className="final-form-card" delay={0.08}>
              <LeadForm assessmentDuration={courses.assessmentDuration} compact idPrefix="final-assessment" />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />

      <aside aria-label="Mobile assessment shortcut" className="mobile-cta-bar">
        <Link className="button button-accent" href="#assessment-form">
          <MousePointerClick aria-hidden="true" />
          Free assessment
        </Link>
      </aside>
    </>
  );
}

function GraduationCapIcon() {
  return <GraduationCap aria-hidden="true" />;
}

function PlaneIcon() {
  return <Plane aria-hidden="true" />;
}
