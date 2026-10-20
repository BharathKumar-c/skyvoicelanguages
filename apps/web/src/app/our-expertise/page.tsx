import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  Headphones,
  Mic,
  MonitorCheck,
  PenLine,
  Plane,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { DrawLine } from "@/components/draw-line";
import { Reveal } from "@/components/reveal";
import { ArtStage, JsonLd, PageCta, RevealFallback } from "@/components/sections/page-parts";
import { PointGrid } from "@/components/sections/point-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrainerDirectory } from "@/components/trainer-directory";
import { methodSteps } from "@/content/landing";
import { getMessages } from "@/i18n/server";
import { organizationLd } from "@/lib/seo/json-ld";
import { siteUrl } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";
import { publishedTrainers } from "@/lib/settings/trainers";

const path = "/our-expertise";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const description = settings.pages.expertise.lede;
  return {
    title: m.expertise.meta.title,
    description,
    alternates: { canonical: siteUrl(settings, path) },
    openGraph: { title: m.expertise.meta.ogTitle, description, url: siteUrl(settings, path) },
  };
}

const subjectIcons = [GraduationCap, Plane, MonitorCheck, PenLine, Mic, Headphones, BookOpenCheck];

export default async function OurExpertisePage() {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const t = m.expertise;
  const { expertise } = settings.pages;
  const trainers = publishedTrainers(settings, m.client.trainer);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(settings),
            ...trainers.map((trainer) => ({
              "@type": "Person",
              name: trainer.name,
              jobTitle: trainer.designation,
              worksFor: { "@id": siteUrl(settings, "/#organization") },
            })),
          ],
        }}
      />
      <RevealFallback />
      <SiteHeader />
      <main className="inner-page" id="main-content">
        <section aria-labelledby="expertise-title" className="page-hero">
          <div className="site-shell page-hero-grid">
            <div className="page-hero-copy hero-enter">
              <span className="eyebrow">{t.eyebrow}</span>
              <h1 id="expertise-title">{expertise.title}</h1>
              <p className="page-hero-lede">{expertise.lede}</p>
              <div className="hero-actions">
                <Link className="button button-accent button-large" href="/enquire-now">
                  {m.shared.enquireNow}
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="button button-secondary button-large" href="#tutors">
                  {m.shared.meetTutors}
                </Link>
              </div>
            </div>
            <div className="page-hero-art hero-enter hero-enter-2">
              <ArtStage context="feedback" eager />
            </div>
          </div>
        </section>

        {expertise.subjects.length ? (
          <section aria-labelledby="subjects-title" className="section">
            <div className="site-shell">
              <Reveal className="section-heading centered-heading">
                <span className="eyebrow">{t.subjectsEyebrow}</span>
                <h2 id="subjects-title">{t.subjectsTitle}</h2>
              </Reveal>
              <PointGrid icons={subjectIcons} points={expertise.subjects} />
            </div>
          </section>
        ) : null}

        <section aria-labelledby="tutors-title" className="section trainers-section section-soft" id="tutors">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{t.tutorsEyebrow}</span>
              <h2 id="tutors-title">{t.tutorsTitle}</h2>
              <p>{t.tutorsBody}</p>
            </Reveal>
            {trainers.length ? (
              <TrainerDirectory trainers={trainers} />
            ) : (
              <div className="pending-card">
                <UsersRound aria-hidden="true" />
                <div>
                  <strong>{t.tutorsPendingTitle}</strong>
                  <p>{t.tutorsPendingBody}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="method-title" className="section method-section">
          <div className="site-shell">
            <Reveal className="section-heading method-heading">
              <div>
                <span className="eyebrow">{t.methodEyebrow}</span>
                <h2 id="method-title">{t.methodTitle}</h2>
              </div>
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

        <PageCta
          body={t.ctaBody}
          id="expertise-cta-title"
          secondary={{ href: "/ielts-pte-coaching-chennai", label: t.ctaSecondary }}
          title={t.ctaTitle}
        />
      </main>
      <SiteFooter />
    </>
  );
}
