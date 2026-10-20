import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeIndianRupee,
  Clock3,
  Headphones,
  KeyRound,
  Laptop2,
  MonitorCheck,
  PenLine,
  SearchCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { EnquireForm } from "@/components/enquire-form";
import { FaqList } from "@/components/faq-list";
import { Reveal } from "@/components/reveal";
import { IeltsCourseCards, PteCourseCards, pteProducts } from "@/components/sections/course-cards";
import { ArtStage, JsonLd, RevealFallback } from "@/components/sections/page-parts";
import { PointGrid } from "@/components/sections/point-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { assessmentHref } from "@/config/site";
import { format } from "@/i18n/merge";
import { getMessages } from "@/i18n/server";
import { faqLd, organizationLd } from "@/lib/seo/json-ld";
import { siteUrl, studentPortalUrl } from "@/lib/settings/format";
import type { SiteSettings } from "@/lib/settings/schema";
import { getSettings } from "@/lib/settings/store";

const path = "/ielts-pte-coaching-chennai";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const { seoTitle, seoDescription } = settings.pages.ieltsPte;
  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: siteUrl(settings, path) },
    openGraph: { title: seoTitle, description: seoDescription, url: siteUrl(settings, path) },
  };
}

function serviceLd(settings: SiteSettings, name: string, fees: string[]) {
  const offers = fees.filter(Boolean).map((price) => ({ "@type": "Offer", price, priceCurrency: "INR" }));
  return {
    "@type": "Service",
    name,
    serviceType: name,
    provider: { "@id": siteUrl(settings, "/#organization") },
    areaServed: ["Chennai", "Online"],
    ...(offers.length ? { offers } : {}),
  };
}

const reasonIcons = [SearchCheck, UsersRound, PenLine, MonitorCheck, BadgeIndianRupee, Laptop2];

export default async function IeltsPteCoachingPage() {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const t = m.ieltsPte;
  const { courses, pages } = settings;
  const { ieltsPte, whyChooseUs } = pages;
  const pte = pteProducts(settings, m.shared);
  const portalUrl = studentPortalUrl(settings);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(settings),
            serviceLd(
              settings,
              "IELTS coaching",
              courses.plans.flatMap((plan) => [plan.academicFee, plan.generalFee]),
            ),
            serviceLd(settings, `${pte} coaching`, courses.pte.plans.map((plan) => plan.fee)),
            ...(ieltsPte.faqs.length ? [faqLd(ieltsPte.faqs)] : []),
          ],
        }}
      />
      <RevealFallback />
      <SiteHeader />
      <main className="inner-page" id="main-content">
        <section aria-labelledby="ielts-pte-title" className="page-hero">
          <div className="site-shell page-hero-grid">
            <div className="page-hero-copy hero-enter">
              <span className="eyebrow">{t.heroEyebrow}</span>
              <h1 id="ielts-pte-title">{ieltsPte.title}</h1>
              <p className="page-hero-lede">{ieltsPte.lede}</p>
              <div className="hero-actions">
                <Link className="button button-accent button-large" href="#enquire">
                  {m.shared.enquireNow}
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="button button-secondary button-large" href={assessmentHref}>
                  {t.freeAssessment}
                </Link>
              </div>
              <nav aria-label={t.jumpLabel} className="jump-links">
                <a href="#ielts">IELTS</a>
                <a href="#pte">PTE</a>
                {ieltsPte.comparison.length ? <a href="#compare">{t.jumpCompare}</a> : null}
                <a href="#portal">{t.jumpPortal}</a>
                {ieltsPte.faqs.length ? <a href="#faq">{t.jumpFaq}</a> : null}
              </nav>
            </div>
            <div className="page-hero-art hero-enter hero-enter-2">
              <ArtStage context="method" eager />
            </div>
          </div>
        </section>

        {whyChooseUs.points.length ? (
          <section aria-labelledby="differentiators-title" className="section">
            <div className="site-shell">
              <Reveal className="section-heading centered-heading">
                <span className="eyebrow">{t.whyEyebrow}</span>
                <h2 id="differentiators-title">{t.whyTitle}</h2>
              </Reveal>
              <PointGrid icons={reasonIcons} points={whyChooseUs.points} />
            </div>
          </section>
        ) : null}

        <section aria-labelledby="ielts-title" className="section fees-section" id="ielts">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{t.ieltsEyebrow}</span>
              <h2 id="ielts-title">{t.ieltsTitle}</h2>
              <p>{t.ieltsBody}</p>
            </Reveal>
            <IeltsCourseCards settings={settings} />
            {courses.feeNote ? <p className="fee-footnote">{courses.feeNote}</p> : null}
            {courses.installmentInfo ? <p className="fee-footnote">{courses.installmentInfo}</p> : null}
          </div>
        </section>

        <section aria-labelledby="pte-title" className="section fees-section section-soft" id="pte">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{pte}</span>
              <h2 id="pte-title">{t.pteTitle}</h2>
              {courses.pte.summary ? <p>{courses.pte.summary}</p> : null}
            </Reveal>
            {courses.pte.plans.length ? (
              <>
                <PteCourseCards settings={settings} />
                {courses.pte.feeNote ? <p className="fee-footnote">{courses.pte.feeNote}</p> : null}
              </>
            ) : (
              <div className="pending-card">
                <Clock3 aria-hidden="true" />
                <div>
                  <strong>{t.ptePendingTitle}</strong>
                  <p>{t.ptePendingBody}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {ieltsPte.comparison.length ? (
          <section aria-labelledby="compare-title" className="section" id="compare">
            <div className="site-shell">
              <Reveal className="section-heading centered-heading">
                <span className="eyebrow">{t.compareEyebrow}</span>
                <h2 id="compare-title">{t.compareTitle}</h2>
                <p>{t.compareBody}</p>
              </Reveal>
              <div aria-label={t.compareTableLabel} className="compare-wrap" role="region" tabIndex={0}>
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className="sr-only">{t.compareFeature}</span>
                      </th>
                      <th scope="col">IELTS</th>
                      <th scope="col">PTE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ieltsPte.comparison.map((row) => (
                      <tr key={row.label}>
                        <th scope="row">{row.label}</th>
                        <td>{row.ielts}</td>
                        <td>{row.pte}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="fee-footnote">{t.compareNote}</p>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="portal-title" className="section section-soft" id="portal">
          <div className="site-shell portal-cta">
            <Headphones aria-hidden="true" className="portal-cta-icon" />
            <div>
              <span className="eyebrow">{t.portalEyebrow}</span>
              <h2 id="portal-title">{t.portalTitle}</h2>
              <p>
                {format(t.portalBody, {
                  sets: courses.portalPracticeSets
                    ? format(t.portalSets, { count: courses.portalPracticeSets })
                    : t.portalSetsFallback,
                })}
              </p>
            </div>
            {portalUrl ? (
              <a className="button button-primary button-large" href={portalUrl}>
                <KeyRound aria-hidden="true" />
                {t.studentLogin}
              </a>
            ) : (
              <Link className="button button-primary button-large" href="#enquire">
                {t.askPortal}
              </Link>
            )}
          </div>
        </section>

        {ieltsPte.faqs.length ? (
          <section aria-labelledby="faq-title" className="section faq-section" id="faq">
            <div className="site-shell faq-grid">
              <Reveal className="faq-intro">
                <span className="eyebrow">{t.faqEyebrow}</span>
                <h2 id="faq-title">{t.faqTitle}</h2>
              </Reveal>
              <Reveal delay={0.08}>
                <FaqList idPrefix="ielts-pte-faq" items={ieltsPte.faqs} />
              </Reveal>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="enquire-title" className="section section-soft" id="enquire">
          <div className="site-shell enquire-grid">
            <Reveal className="section-copy">
              <span className="eyebrow">{t.enquireEyebrow}</span>
              <h2 id="enquire-title">{t.enquireTitle}</h2>
              <p>{t.enquireBody}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <EnquireForm idPrefix="ielts-pte-enquire" />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
