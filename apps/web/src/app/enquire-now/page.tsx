import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";

import { EnquireForm } from "@/components/enquire-form";
import { JourneySteps } from "@/components/sections/journey-steps";
import { JsonLd, RevealFallback } from "@/components/sections/page-parts";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getMessages } from "@/i18n/server";
import { organizationLd } from "@/lib/seo/json-ld";
import { siteUrl, telDigits, whatsappHref } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";

const path = "/enquire-now";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const description = settings.pages.enquire.lede;
  return {
    title: m.enquire.meta.title,
    description,
    alternates: { canonical: siteUrl(settings, path) },
    openGraph: { title: m.enquire.meta.ogTitle, description, url: siteUrl(settings, path) },
  };
}

export default async function EnquireNowPage() {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const t = m.enquire;
  const { enquire, home } = settings.pages;
  const phone = settings.contact.phones[0];
  const whatsapp = whatsappHref(settings);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(settings),
            { "@type": "ContactPage", name: "Enquire now", url: siteUrl(settings, path) },
          ],
        }}
      />
      <RevealFallback />
      <SiteHeader />
      <main className="inner-page" id="main-content">
        <section aria-labelledby="enquire-title" className="page-hero enquire-hero">
          <div className="site-shell enquire-grid">
            <div className="page-hero-copy hero-enter">
              <span className="eyebrow">{t.eyebrow}</span>
              <h1 id="enquire-title">{enquire.title}</h1>
              <p className="page-hero-lede">{enquire.lede}</p>
              {phone || whatsapp ? (
                <div className="hero-actions">
                  {whatsapp ? (
                    <a
                      className="button button-secondary button-large"
                      href={whatsapp}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <MessageCircle aria-hidden="true" />
                      {t.whatsapp}
                      <span className="sr-only">{m.client.common.opensWhatsapp}</span>
                    </a>
                  ) : null}
                  {phone ? (
                    <a className="button button-secondary button-large" href={`tel:${telDigits(phone)}`}>
                      <Phone aria-hidden="true" />
                      {phone}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="hero-enter hero-enter-2">
              <EnquireForm />
            </div>
          </div>
        </section>

        <JourneySteps id="what-happens-next" steps={home.onboardingSteps} title={t.nextTitle} />
      </main>
      <SiteFooter />
    </>
  );
}
