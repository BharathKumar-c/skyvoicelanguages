import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Headphones,
  Laptop2,
  MessageCircleMore,
  MousePointerClick,
  PlayCircle,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TimerReset,
  TrendingUp,
  Video,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";

import { AiraContext, AiraModule } from "@/components/mascot";
import { BrandLogo } from "@/components/brand-logo";
import { FaqList } from "@/components/faq-list";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { VslPreview } from "@/components/vsl-preview";
import { siteConfig } from "@/config/site";
import {
  audiences,
  faqs,
  methodSteps,
  modules,
  pricing,
  scoreGaps,
  trustPoints,
} from "@/content/landing";

export const metadata: Metadata = {
  title: "Online IELTS Coaching & Free Assessment",
  description:
    "Find the exact IELTS skills holding back your score. Book a free online assessment for a personalised Academic or General Training roadmap.",
  alternates: {
    canonical: `${siteConfig.url}${siteConfig.campaignPath}`,
  },
  openGraph: {
    title: "Know what is holding back your IELTS score",
    description:
      "Free IELTS assessment, a clear preparation roadmap, and personalised online coaching for Academic and General Training.",
    url: `${siteConfig.url}${siteConfig.campaignPath}`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/skyvoice-icon.svg`,
    },
    {
      "@type": "Service",
      "@id": `${siteConfig.url}${siteConfig.campaignPath}#service`,
      name: "Online IELTS Coaching and Assessment",
      provider: { "@id": `${siteConfig.url}/#organization` },
      serviceType: "IELTS coaching",
      areaServed: "Online",
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
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function FreeIeltsAssessmentPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <SiteHeader />
      <main id="main-content">
        <section className="hero section" id="top">
          <div aria-hidden="true" className="hero-ambient hero-ambient-one" />
          <div aria-hidden="true" className="hero-ambient hero-ambient-two" />
          <div className="site-shell hero-grid">
            <div className="hero-content">
              <Reveal>
                <div className="hero-eyebrow-row">
                  <span className="eyebrow">
                    <Sparkles aria-hidden="true" />
                    Online IELTS coaching
                  </span>
                  <span className="availability-dot">Academic + General</span>
                </div>
                <h1>
                  Stuck at Band 5 or 6?
                  <span> Find the exact gap.</span>
                </h1>
                <p className="hero-lede">
                  Stop preparing blindly. Start with a free assessment that maps your
                  current level, weak modules, target band, and clearest route forward.
                </p>
                <div className="hero-actions">
                  <Link className="button button-accent button-large" href="#assessment-form">
                    Book my free assessment
                    <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link className="button button-secondary button-large" href="#method">
                    See how it works
                  </Link>
                </div>
                <p className="hero-reassurance">
                  <ShieldCheck aria-hidden="true" />
                  Free whether you join or not. No payment details.
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <VslPreview />
              </Reveal>

              <Reveal className="hero-mascot-wrap" delay={0.16}>
                <AiraContext
                  context="hero"
                  size="xl"
                  aria-label="Aira, your SkyVoice IELTS guide, welcomes you"
                />
              </Reveal>
            </div>

            <Reveal className="hero-form-wrap" delay={0.12}>
              <div className="hero-form-accent" aria-hidden="true">
                <span>Start here</span>
                <ArrowRight />
              </div>
              <LeadForm idPrefix="assessment" />
            </Reveal>
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
                <div className="route-line" />
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
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">Why scores get stuck</span>
              <h2>Practice tells you the score. Diagnosis tells you what to change.</h2>
              <p>
                To move a band, you need four answers that another random mock rarely
                gives you.
              </p>
            </Reveal>
            <div className="gap-grid">
              {scoreGaps.map((gap, index) => (
                <Reveal className="gap-card" delay={index * 0.04} key={gap.title}>
                  <span className="number-chip">0{index + 1}</span>
                  <gap.icon aria-hidden="true" />
                  <h3>{gap.title}</h3>
                  <p>{gap.body}</p>
                </Reveal>
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
              <div className="method-line" aria-hidden="true" />
              {methodSteps.map((step, index) => (
                <Reveal className="method-step" delay={index * 0.04} key={step.number}>
                  <div className={`method-marker ${step.free ? "is-free" : ""}`}>
                    <step.icon aria-hidden="true" />
                    {step.free ? <span>Free</span> : null}
                  </div>
                  <span className="step-number">{step.number}</span>
                  <h3>{step.label}</h3>
                  <p>{step.body}</p>
                </Reveal>
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

            <div className="module-grid">
              {modules.map((module, index) => (
                <Reveal
                  className={`module-card module-card-${index + 1}`}
                  delay={index * 0.05}
                  key={module.name}
                >
                  <div className="module-icon module-icon-mascot">
                    <AiraModule
                      module={
                        module.name.toLowerCase() as
                          | "listening"
                          | "reading"
                          | "writing"
                          | "speaking"
                      }
                      size="md"
                      idle="breathe"
                      sparkPulse={false}
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
                </Reveal>
              ))}
            </div>

            <Reveal className="test-type-banner">
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
            </Reveal>
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
                <div>
                  <strong>80</strong>
                  <span>practice sets</span>
                </div>
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
                Access duration will be displayed after final client confirmation.
              </p>
            </Reveal>

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
                  <BrandLogo />
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
          </div>
        </section>

        <section className="section audience-section" id="audience">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">Built around real life</span>
              <h2>For people preparing with a deadline, a job, or a second attempt.</h2>
            </Reveal>
            <div className="audience-grid">
              {audiences.map((audience, index) => (
                <Reveal className="audience-card" delay={index * 0.035} key={audience.title}>
                  <audience.icon aria-hidden="true" />
                  <div>
                    <h3>{audience.title}</h3>
                    <p>{audience.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="not-for-card">
              <span>Probably not for you if…</span>
              <p>
                You only want last-minute exam tips at 7.5+, or the lowest-cost
                40-student lecture batch. Sky Voice is built around small groups and
                personalised 1-on-1 attention.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section fees-section" id="fees">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">Clear formats · transparent fees</span>
              <h2>Two ways to train. One personalised method.</h2>
              <p>Both include the assessment, roadmap, portal, and tutor support.</p>
            </Reveal>
            <div className="pricing-grid">
              {pricing.map((plan, index) => (
                <Reveal
                  className={`pricing-card ${plan.featured ? "is-featured" : ""}`}
                  delay={index * 0.08}
                  key={plan.name}
                >
                  {plan.featured ? <span className="popular-badge">Most focused</span> : null}
                  <div className="pricing-title">
                    <span>
                      <plan.icon aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{plan.name}</h3>
                      <p>{plan.size}</p>
                    </div>
                  </div>
                  <dl className="price-list">
                    <div>
                      <dt>IELTS Academic</dt>
                      <dd>{plan.academic}</dd>
                    </div>
                    <div>
                      <dt>IELTS General Training</dt>
                      <dd>{plan.general}</dd>
                    </div>
                  </dl>
                  <ul className="plan-features">
                    <li>
                      <Check aria-hidden="true" /> {plan.bestFor}
                    </li>
                    <li>
                      <Check aria-hidden="true" /> {plan.schedule}
                    </li>
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
                </Reveal>
              ))}
            </div>
            <Reveal className="price-note">
              <WandSparkles aria-hidden="true" />
              <div>
                <strong>Not sure which format fits?</strong>
                <p>Your free assessment ends with a format recommendation—before you pay.</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section proof-section">
          <div className="site-shell proof-grid">
            <Reveal className="proof-visual">
              <div className="proof-ring">
                <span>
                  <TrendingUp aria-hidden="true" />
                </span>
                <strong>Progress you can explain</strong>
                <p>Not a mystery score. A visible chain from feedback to correction.</p>
              </div>
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
              <FaqList />
            </Reveal>
          </div>
        </section>

        <section className="section final-cta" id="final-assessment">
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
              <LeadForm compact idPrefix="final-assessment" />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-shell footer-grid">
          <div className="footer-brand">
            <BrandLogo variant="white" />
            <p>
              Personalised online IELTS preparation for people with a real target and a
              reason to reach it.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <strong>Explore</strong>
              <Link href="#method">Method</Link>
              <Link href="#modules">Modules</Link>
              <Link href="#portal">Portal</Link>
              <Link href="#fees">Fees</Link>
            </div>
            <div>
              <strong>Support</strong>
              <Link href="#faq">FAQ</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="site-shell footer-bottom">
          <p>© {new Date().getFullYear()} Sky Voice Languages.</p>
          <p>
            Sky Voice is an independent coaching provider. IELTS is jointly owned by
            the British Council, IDP: IELTS Australia, and Cambridge University Press
            &amp; Assessment. Results vary by student effort and starting level.
          </p>
        </div>
      </footer>

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
  return <BookOpenCheck aria-hidden="true" />;
}

function PlaneIcon() {
  return <PlayCircle aria-hidden="true" />;
}
