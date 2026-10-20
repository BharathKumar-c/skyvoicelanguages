import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeIndianRupee,
  Laptop2,
  MessagesSquare,
  MonitorCheck,
  PenLine,
  SearchCheck,
  Smartphone,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { JourneySteps } from "@/components/sections/journey-steps";
import { ArtStage, JsonLd, PageCta, RevealFallback } from "@/components/sections/page-parts";
import { PointGrid } from "@/components/sections/point-grid";
import { ProofSection } from "@/components/sections/proof-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getMessages } from "@/i18n/server";
import { organizationLd } from "@/lib/seo/json-ld";
import { siteUrl } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";

const path = "/why-choose-us";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const description = settings.pages.whyChooseUs.lede;
  return {
    title: m.why.meta.title,
    description,
    alternates: { canonical: siteUrl(settings, path) },
    openGraph: { title: m.why.meta.ogTitle, description, url: siteUrl(settings, path) },
  };
}

const reasonIcons = [SearchCheck, UsersRound, PenLine, MonitorCheck, BadgeIndianRupee, Laptop2];
const learningIcons = [Smartphone, MessagesSquare, TrendingUp, UsersRound];

export default async function WhyChooseUsPage() {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const t = m.why;
  const { whyChooseUs, home } = settings.pages;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(settings),
            {
              "@type": "WebPage",
              "@id": siteUrl(settings, `${path}#page`),
              name: whyChooseUs.title,
              url: siteUrl(settings, path),
              about: { "@id": siteUrl(settings, "/#organization") },
            },
          ],
        }}
      />
      <RevealFallback />
      <SiteHeader />
      <main className="inner-page" id="main-content">
        <section aria-labelledby="why-title" className="page-hero">
          <div className="site-shell page-hero-grid">
            <div className="page-hero-copy hero-enter">
              <span className="eyebrow">{t.eyebrow}</span>
              <h1 id="why-title">{whyChooseUs.title}</h1>
              <p className="page-hero-lede">{whyChooseUs.lede}</p>
              <div className="hero-actions">
                <Link className="button button-accent button-large" href="/enquire-now">
                  {m.shared.enquireNow}
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="button button-secondary button-large" href="/our-expertise">
                  {m.shared.meetTutors}
                </Link>
              </div>
            </div>
            <div className="page-hero-art hero-enter hero-enter-2">
              <ArtStage context="celebration" eager />
            </div>
          </div>
        </section>

        {whyChooseUs.points.length ? (
          <section aria-labelledby="reasons-title" className="section">
            <div className="site-shell">
              <Reveal className="section-heading centered-heading">
                <span className="eyebrow">{t.reasonsEyebrow}</span>
                <h2 id="reasons-title">{t.reasonsTitle}</h2>
              </Reveal>
              <PointGrid icons={reasonIcons} points={whyChooseUs.points} />
            </div>
          </section>
        ) : null}

        <ProofSection
          eyebrow={t.proofEyebrow}
          id="recognition"
          pendingNote
          settings={settings}
          title={t.proofTitle}
        />

        {home.learningPoints.length ? (
          <section aria-labelledby="learning-title" className="section section-soft">
            <div className="site-shell">
              <Reveal className="section-heading centered-heading">
                <span className="eyebrow">{m.shared.howYouLearn}</span>
                <h2 id="learning-title">{home.learningTitle || m.shared.howYouLearnFallback}</h2>
                {home.learningIntro ? <p>{home.learningIntro}</p> : null}
              </Reveal>
              <PointGrid icons={learningIcons} points={home.learningPoints} />
            </div>
          </section>
        ) : null}

        <JourneySteps id="how-you-join" steps={home.onboardingSteps} title={home.onboardingTitle} />

        <PageCta body={t.ctaBody} id="why-cta-title" title={t.ctaTitle} />
      </main>
      <SiteFooter />
    </>
  );
}
