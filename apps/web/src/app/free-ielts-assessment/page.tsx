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
  Quote,
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
import { IeltsDestinations } from "@/components/ielts-destinations";
import { InteractiveWaves } from "@/components/interactive-waves";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ServiceVideo } from "@/components/service-video";
import { SocialBand } from "@/components/social-band";
import { SuccessStories } from "@/components/success-stories";
import { landingVideos } from "@/config/media";
import { siteConfig } from "@/config/site";
import { audiences, methodSteps, modules, scoreGaps } from "@/content/landing";
import { format } from "@/i18n/merge";
import { getMessages } from "@/i18n/server";
import { brandLogos, formatFee, siteUrl } from "@/lib/settings/format";
import type { SiteSettings } from "@/lib/settings/schema";
import { getSettings } from "@/lib/settings/store";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const url = siteUrl(settings, siteConfig.campaignPath);
  const t = m.campaign.meta;
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: url },
    openGraph: { title: t.ogTitle, description: t.ogDescription, url },
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
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const t = m.campaign;
  const s = m.shared;
  const { courses, content } = settings;
  const stories = settings.results.testimonials.filter((story) => story.published && story.consent);
  const { hero } = content;
  const baseVideos = landingVideos(settings);
  const videos = {
    hero: { ...baseVideos.hero, title: m.client.video.heroTitle, label: m.client.video.heroLabel },
    service: { ...baseVideos.service, title: m.client.video.serviceTitle, label: m.client.video.serviceLabel },
  };
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
                    <span className="availability-dot">{t.availability}</span>
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
                      aria-label={t.heroAiraLabel}
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
                  <span>{t.startHere}</span>
                  <ArrowRight />
                </div>
                <LeadForm assessmentDuration={courses.assessmentDuration} idPrefix="assessment" />
              </div>
            </div>
          </div>

          <div className="site-shell trust-strip" aria-label={t.trustLabel}>
            {m.landing.trustPoints.map((item, index) => (
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
              <span className="eyebrow">{t.video.eyebrow}</span>
              <h2 id="video-title">{t.video.title}</h2>
              <p>{t.video.body}</p>
            </Reveal>
            <Reveal className="video-stage" delay={0.06}>
              <ServiceVideo video={videos.service} />
            </Reveal>
            <div className="video-points">
              <span>
                <SearchCheck aria-hidden="true" /> {t.video.points[0]}
              </span>
              <span>
                <Target aria-hidden="true" /> {t.video.points[1]}
              </span>
              <span>
                <Route aria-hidden="true" /> {t.video.points[2]}
              </span>
            </div>
          </div>
        </section>

        <section className="section transformation" id="results">
          <div className="site-shell split-layout">
            <Reveal className="section-copy">
              <span className="eyebrow">{t.transformation.eyebrow}</span>
              <h2>
                {t.transformation.titleLead}
                <span>{t.transformation.titleEmphasis}</span>
              </h2>
              <p>{t.transformation.body}</p>
              <ul className="check-list">
                {t.transformation.checks.map((item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="proof-note">{t.transformation.proofNote}</p>
            </Reveal>

            <Reveal className="score-journey" delay={0.08}>
              <div className="score-card score-card-before">
                <span>{t.transformation.before}</span>
                <strong>6.0</strong>
                <small>{t.transformation.beforeNote}</small>
              </div>
              <div className="score-route" aria-hidden="true">
                <DrawLine className="route-line" delay={0.35} />
                <span>
                  <Route />
                </span>
                <b>{t.transformation.route}</b>
              </div>
              <div className="score-card score-card-after">
                <span>{t.transformation.target}</span>
                <strong>7.0</strong>
                <small>{t.transformation.targetNote}</small>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section section-soft" id="why-stuck">
          <div className="site-shell feature-split">
            <Reveal className="feature-head">
              <span className="eyebrow">{t.whyStuck.eyebrow}</span>
              <h2>{t.whyStuck.title}</h2>
              <p>{t.whyStuck.body}</p>
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
              {scoreGaps(m.landing).map((gap, index) => (
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
                <span className="eyebrow">{t.method.eyebrow}</span>
                <h2>{t.method.title}</h2>
              </div>
              <Link className="text-link" href="#assessment-form">
                {t.method.link}
                <ChevronRight aria-hidden="true" />
              </Link>
            </Reveal>

            <div className="method-path">
              <DrawLine className="method-line" duration={1.2} />
              {methodSteps(m.landing).map((step) => (
                <div className="method-step" key={step.number}>
                  <div className={`method-marker ${step.free ? "is-free" : ""}`}>
                    <step.icon aria-hidden="true" />
                    {step.free ? <span>{s.free}</span> : null}
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
              <span className="eyebrow">{t.modules.eyebrow}</span>
              <h2>{t.modules.title}</h2>
              <p>{t.modules.body}</p>
            </Reveal>

            <Reveal className="module-tableau" delay={0.04}>
              <div className="module-tableau-aira">
                <div className="aira-figure">
                  <AiraContext
                    context="feedback"
                    size="xl"
                    aria-label={t.modules.airaLabel}
                  />
                  <AiraGroundShadow tone="light" width={190} />
                </div>
              </div>
              <div className="module-tableau-copy">
                <strong>{t.modules.tableauTitle}</strong>
                <p>{t.modules.tableauBody}</p>
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

            <div aria-label={t.modules.regionLabel} className="module-grid" role="region" tabIndex={0}>
              {modules(m.landing).map((module, index) => (
                <div
                  className={`module-card module-card-${index + 1}`}
                  key={module.name}
                >
                  <div className="module-signal" aria-hidden="true">
                    <SkillSignal
                      className="module-signal-image"
                      module={module.signal as SkillSignalModule}
                      state="active"
                      size={152}
                      decorative
                    />
                    <SkillSignal
                      className="module-signal-success"
                      module={module.signal as SkillSignalModule}
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
                  <strong>{s.ieltsAcademic}</strong>
                  <p>{t.modules.academicBody}</p>
                </div>
              </div>
              <div>
                <span className="type-icon">
                  <PlaneIcon />
                </span>
                <div>
                  <strong>{s.ieltsGeneral}</strong>
                  <p>{t.modules.generalBody}</p>
                </div>
              </div>
              <Link href="#assessment-form">{t.modules.chooseLink}</Link>
            </div>
          </div>
        </section>

        <section className="section portal-section" id="portal">
          <div className="site-shell portal-grid">
            <Reveal className="portal-copy">
              <span className="eyebrow">{t.portal.eyebrow}</span>
              <h2>{t.portal.title}</h2>
              <p>{t.portal.body}</p>
              <div className="portal-features">
                {courses.portalPracticeSets ? (
                  <div>
                    <strong>{courses.portalPracticeSets}</strong>
                    <span>{t.portal.practiceSets}</span>
                  </div>
                ) : null}
                <div>
                  <strong>4</strong>
                  <span>{t.portal.modules}</span>
                </div>
                <div>
                  <strong>A + G</strong>
                  <span>{t.portal.testTypes}</span>
                </div>
              </div>
              <p className="inline-note">
                <Clock3 aria-hidden="true" />
                {courses.portalAccessDuration
                  ? format(t.portal.access, { duration: courses.portalAccessDuration })
                  : t.portal.accessPending}
              </p>
            </Reveal>

            <div className="portal-stage">
              <Reveal
                ariaLabel={t.portal.previewLabel}
                className="portal-preview"
                delay={0.08}
                role="region"
                tabIndex={0}
              >
                <div className="portal-window-bar">
                  <span />
                  <span />
                  <span />
                  <small>{t.portal.windowBar}</small>
                </div>
                <div className="portal-body">
                  <aside>
                    <BrandLogo src={brandLogos(settings).default} />
                    <nav aria-label={t.portal.navLabel}>
                      <span className="active">
                        <Headphones aria-hidden="true" /> {t.portal.navPractice}
                      </span>
                      <span>
                        <Target aria-hidden="true" /> {t.portal.navProgress}
                      </span>
                      <span>
                        <MessageCircleMore aria-hidden="true" /> {t.portal.navTutor}
                      </span>
                    </nav>
                  </aside>
                  {/* Example exam content: kept in English in every language. */}
                  <div className="portal-question" lang="en">
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
              <span className="eyebrow">{t.audience.eyebrow}</span>
              <h2>{t.audience.title}</h2>
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
              {audiences(m.landing).map((audience) => (
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
              <span>{t.audience.notForTitle}</span>
              <p>{t.audience.notForBody}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="destinations-title" className="section destinations-section" id="destinations">
          <div aria-hidden="true" className="destinations-route">
            <svg height="120" viewBox="0 0 900 120" width="900">
              <path d="M 10 100 C 250 0, 650 0, 890 100" />
              <circle className="route-start" cx="10" cy="100" r="7" />
              <circle className="route-end" cx="890" cy="100" r="7" />
            </svg>
            <span className="destinations-plane">
              <Plane />
            </span>
          </div>
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{t.destinations.eyebrow}</span>
              <h2 id="destinations-title">{t.destinations.title}</h2>
              <p>{t.destinations.body}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <IeltsDestinations />
            </Reveal>
            <p className="destinations-note">{t.destinations.note}</p>
          </div>
        </section>

        <section className="section fees-section" id="fees">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{t.fees.eyebrow}</span>
              <h2>{t.fees.title}</h2>
              {courses.feeNote ? <p>{courses.feeNote}</p> : null}
            </Reveal>
            <div className="pricing-grid">
              {courses.plans.map((plan) => (
                <div
                  className={`pricing-card ${plan.featured ? "is-featured" : ""}`}
                  key={plan.name}
                >
                  {plan.featured ? <span className="popular-badge">{s.mostFocused}</span> : null}
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
                      <dt>{s.ieltsAcademic}</dt>
                      <dd>{formatFee(plan.academicFee) ?? s.feeOnRequest}</dd>
                    </div>
                    <div>
                      <dt>{s.ieltsGeneral}</dt>
                      <dd>{formatFee(plan.generalFee) ?? s.feeOnRequest}</dd>
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
                      <Check aria-hidden="true" /> {s.writingSpeakingFeedback}
                    </li>
                  </ul>
                  <Link
                    className={`button ${plan.featured ? "button-accent" : "button-secondary"}`}
                    href="#assessment-form"
                  >
                    {t.fees.findFormat}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
            <div className="price-note">
              <WandSparkles aria-hidden="true" />
              <div>
                <strong>{t.fees.noteTitle}</strong>
                <p>{t.fees.noteBody}</p>
                {courses.installmentInfo ? (
                  <p className="price-installment">{courses.installmentInfo}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="stories-title" className="section stories-section" id="stories">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{t.stories.eyebrow}</span>
              <h2 id="stories-title">{t.stories.title}</h2>
              <p>{t.stories.body}</p>
            </Reveal>
            {stories.length ? (
              <Reveal delay={0.06}>
                <SuccessStories stories={stories} />
              </Reveal>
            ) : (
              <div className="pending-card">
                <Quote aria-hidden="true" />
                <div>
                  <strong>{t.stories.pendingTitle}</strong>
                  <p>{t.stories.pendingBody}</p>
                </div>
              </div>
            )}
            <p className="stories-cta">
              <Link className="button button-accent" href="#final-assessment">
                {t.stories.cta}
                <ArrowRight aria-hidden="true" />
              </Link>
            </p>
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
                <strong>{t.proof.captionTitle}</strong>
                {t.proof.caption}
              </p>
              <div className="proof-float proof-float-one">
                <CheckCircle2 aria-hidden="true" />
                {t.proof.floats[0]}
              </div>
              <div className="proof-float proof-float-two">
                <CheckCircle2 aria-hidden="true" />
                {t.proof.floats[1]}
              </div>
              <div className="proof-float proof-float-three">
                <CheckCircle2 aria-hidden="true" />
                {t.proof.floats[2]}
              </div>
            </Reveal>
            <Reveal className="section-copy" delay={0.08}>
              <span className="eyebrow">{t.proof.eyebrow}</span>
              <h2>{t.proof.title}</h2>
              <p>{t.proof.body}</p>
              <div className="proof-standards">
                <div>
                  <BadgeCheck aria-hidden="true" />
                  <span>
                    <strong>{t.proof.standards[0].title}</strong>
                    {t.proof.standards[0].body}
                  </span>
                </div>
                <div>
                  <Video aria-hidden="true" />
                  <span>
                    <strong>{t.proof.standards[1].title}</strong>
                    {t.proof.standards[1].body}
                  </span>
                </div>
                <div>
                  <Star aria-hidden="true" />
                  <span>
                    <strong>{t.proof.standards[2].title}</strong>
                    {t.proof.standards[2].body}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="site-shell faq-grid">
            <Reveal className="faq-intro">
              <span className="eyebrow">{t.faq.eyebrow}</span>
              <h2>{t.faq.title}</h2>
              <p>{t.faq.body}</p>
              <Link className="button button-secondary" href="#final-assessment">
                {t.faq.ready}
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
              <span className="eyebrow eyebrow-on-dark">{t.final.eyebrow}</span>
              <h2>{t.final.title}</h2>
              <p>{t.final.body}</p>
              <ol className="next-steps">
                {t.final.steps.map((step, index) => (
                  <li key={step.title}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal className="final-form-card" delay={0.08}>
              <LeadForm assessmentDuration={courses.assessmentDuration} compact idPrefix="final-assessment" />
            </Reveal>
          </div>
        </section>
        <SocialBand />
      </main>

      <SiteFooter />

      <aside aria-label={t.mobileBarLabel} className="mobile-cta-bar">
        <Link className="button button-accent" href="#assessment-form">
          <MousePointerClick aria-hidden="true" />
          {t.mobileBar}
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
