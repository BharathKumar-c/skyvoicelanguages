import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  CalendarOff,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import Link from "next/link";

import { BranchLocations } from "@/components/branch-locations";
import { ContactForm } from "@/components/contact-form";
import { FaqList } from "@/components/faq-list";
import { AiraContext, AiraGroundShadow } from "@/components/mascot";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SocialIcon, socialLabels } from "@/components/social-icon";
import { assessmentHref, siteConfig } from "@/config/site";
import { format } from "@/i18n/merge";
import { getMessages } from "@/i18n/server";
import { siteUrl, telDigits as digits, whatsappHref as whatsappLink } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const title = format(m.contact.meta.title, { company: settings.company.name });
  return {
    title,
    description: m.contact.meta.description,
    alternates: { canonical: siteUrl(settings, "/contact") },
    openGraph: { title, description: m.contact.meta.ogDescription, url: siteUrl(settings, "/contact") },
  };
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Phone;
  label: string;
  children: React.ReactNode;
}) {
  return (
    // A <dl> group may contain only <dt>/<dd>, so the icon lives inside the <dt>.
    <div className="contact-row">
      <dt>
        <Icon aria-hidden="true" />
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function ContactPage() {
  const [settings, m] = await Promise.all([getSettings(), getMessages()]);
  const t = m.contact;
  const opensWhatsapp = m.client.common.opensWhatsapp;
  const { contact, company } = settings;
  const contactDetails = { ...contact, centreName: company.name };
  const { branches } = contact;
  const socialLinks = company.socialLinks;
  const contactFaqs = settings.content.contactFaqs;
  const phone = contact.phones[0] ?? null;
  const whatsappHref = whatsappLink(settings);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": siteUrl(settings, "/contact#page"),
    name: `Contact ${company.name}`,
    url: siteUrl(settings, "/contact"),
    about: { "@id": siteUrl(settings, "/#organization") },
    ...(phone || contact.email
      ? {
          mainEntity: {
            "@type": "Organization",
            "@id": siteUrl(settings, "/#organization"),
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              ...(phone ? { telephone: digits(phone) } : {}),
              ...(contact.email ? { email: contact.email } : {}),
            },
          },
        }
      : {}),
  };

  const hasDirectContact = Boolean(phone || whatsappHref || contactDetails.email);
  const missingDetails =
    !contactDetails.address.length ||
    !phone ||
    !contactDetails.whatsapp ||
    !contactDetails.email ||
    !contactDetails.hours.length;

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
        <section aria-labelledby="contact-title" className="page-hero">
          <div className="site-shell page-hero-grid">
            <div className="page-hero-copy hero-enter">
              <span className="eyebrow">{t.eyebrow}</span>
              <h1 id="contact-title">{contact.pageTitle}</h1>
              <p className="page-hero-lede">{contact.pageIntro}</p>
              <div className="hero-actions">
                {hasDirectContact ? (
                  <>
                    {phone ? (
                      <a className="button button-secondary button-large" href={`tel:${digits(phone)}`}>
                        <Phone aria-hidden="true" />
                        {t.callUs}
                      </a>
                    ) : null}
                    {whatsappHref ? (
                      <a
                        className="button button-secondary button-large"
                        href={whatsappHref}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <MessageCircle aria-hidden="true" />
                        {t.whatsapp}
                        <span className="sr-only">{opensWhatsapp}</span>
                      </a>
                    ) : null}
                    {contactDetails.email ? (
                      <a
                        className="button button-secondary button-large"
                        href={`mailto:${contactDetails.email}`}
                      >
                        <Mail aria-hidden="true" />
                        {t.email}
                      </a>
                    ) : null}
                  </>
                ) : (
                  <a className="button button-primary button-large" href="#enquiry-form">
                    {t.sendEnquiry}
                    <ArrowRight aria-hidden="true" />
                  </a>
                )}
                <Link className="button button-accent button-large" href={assessmentHref}>
                  {m.shared.bookAssessment}
                </Link>
              </div>
            </div>
            <div className="page-hero-art hero-enter hero-enter-2">
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
                  <AiraContext context="contact-hero" decorative eager />
                  <AiraGroundShadow width={160} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="details-title" className="section contact-section">
          <div className="site-shell contact-grid">
            <Reveal className="contact-details">
              <span className="eyebrow">{t.infoEyebrow}</span>
              <h2 id="details-title">{contactDetails.centreName}</h2>
              <dl className="contact-list">
                {contactDetails.address.length ? (
                  <DetailRow icon={MapPin} label={t.officeAddress}>
                    <address>
                      {contactDetails.address.map((line) => (
                        <span className="branch-address-line" key={line}>
                          {line}
                        </span>
                      ))}
                    </address>
                  </DetailRow>
                ) : null}
                {contactDetails.phones.length ? (
                  <DetailRow icon={Phone} label={contactDetails.phones.length > 1 ? t.phones : t.phone}>
                    {contactDetails.phones.map((number) => (
                      <a className="contact-link" href={`tel:${digits(number)}`} key={number}>
                        {number}
                      </a>
                    ))}
                  </DetailRow>
                ) : null}
                {whatsappHref && contactDetails.whatsapp ? (
                  <DetailRow icon={MessageCircle} label={t.whatsapp}>
                    <a className="contact-link" href={whatsappHref} rel="noopener noreferrer" target="_blank">
                      {contactDetails.whatsapp}
                      <span className="sr-only">{opensWhatsapp}</span>
                    </a>
                  </DetailRow>
                ) : null}
                {contactDetails.email ? (
                  <DetailRow icon={Mail} label={t.email}>
                    <a className="contact-link" href={`mailto:${contactDetails.email}`}>
                      {contactDetails.email}
                    </a>
                  </DetailRow>
                ) : null}
                {contactDetails.hours.length ? (
                  <DetailRow icon={Clock3} label={t.businessHours}>
                    {contactDetails.hours.map((line) => (
                      <span className="branch-address-line" key={line}>
                        {line}
                      </span>
                    ))}
                  </DetailRow>
                ) : null}
                {contactDetails.weeklyHoliday ? (
                  <DetailRow icon={CalendarOff} label={t.weeklyHoliday}>
                    {contactDetails.weeklyHoliday}
                  </DetailRow>
                ) : null}
              </dl>
              {missingDetails ? (
                <p className="contact-pending">
                  <Clock3 aria-hidden="true" />
                  <span>
                    {hasDirectContact ? t.remainingPending : t.allPending}
                  </span>
                </p>
              ) : null}

              <div className="contact-social">
                <h3>
                  <Share2 aria-hidden="true" /> {t.follow}
                </h3>
                {socialLinks.length ? (
                  <ul className="social-list">
                    {socialLinks.map((link) => (
                      <li key={link.platform}>
                        <a
                          aria-label={`${socialLabels[link.platform]}${m.client.common.opensNewTab}`}
                          className="social-link"
                          href={link.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <SocialIcon platform={link.platform} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted-note">{t.socialPending}</p>
                )}
              </div>
            </Reveal>
            <Reveal className="contact-form-wrap" delay={0.06}>
              <ContactForm branches={branches} />
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="locations-title" className="section locations-section">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">{t.locationsEyebrow}</span>
              <h2 id="locations-title">{t.locationsTitle}</h2>
              {branches.length ? <p>{t.locationsBody}</p> : null}
            </Reveal>
            {branches.length ? (
              <BranchLocations branches={branches} />
            ) : (
              <div className="pending-card">
                <Building2 aria-hidden="true" />
                <div>
                  <strong>{t.onlineTitle}</strong>
                  <p>{t.onlineBody}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="contact-faq-title" className="section faq-section">
          <div className="site-shell faq-grid">
            <Reveal className="faq-intro">
              <span className="eyebrow">{t.faqEyebrow}</span>
              <h2 id="contact-faq-title">{t.faqTitle}</h2>
              <p>
                {t.faqBodyBefore}{" "}
                <Link className="text-link-inline" href={`${siteConfig.campaignPath}#faq`}>
                  {t.faqLink}
                </Link>{" "}
                {t.faqBodyAfter}
              </p>
            </Reveal>
            <FaqList idPrefix="contact-faq" items={contactFaqs} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
