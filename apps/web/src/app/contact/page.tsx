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
import { branches, contactDetails, contactFaqs, socialLinks } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact Sky Voice Languages",
  description:
    "Ask Sky Voice about IELTS coaching, fees, class timings, or the free assessment. Send an enquiry and the team will reply.",
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: {
    title: "Contact Sky Voice Languages",
    description: "Questions about IELTS coaching, fees, or the free assessment? Send an enquiry.",
    url: `${siteConfig.url}/contact`,
  },
};

const digits = (value: string) => value.replace(/[^\d+]/g, "");
const phone = contactDetails.phones[0] ?? null;
const whatsappHref = contactDetails.whatsapp
  ? `https://wa.me/${digits(contactDetails.whatsapp).replace("+", "")}`
  : null;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${siteConfig.url}/contact#page`,
  name: "Contact Sky Voice Languages",
  url: `${siteConfig.url}/contact`,
  about: { "@id": `${siteConfig.url}/#organization` },
  ...(phone || contactDetails.email
    ? {
        mainEntity: {
          "@type": "Organization",
          "@id": `${siteConfig.url}/#organization`,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            ...(phone ? { telephone: digits(phone) } : {}),
            ...(contactDetails.email ? { email: contactDetails.email } : {}),
          },
        },
      }
    : {}),
};

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
    <div className="contact-row">
      <Icon aria-hidden="true" />
      <div>
        <dt>{label}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const hasDirectContact = Boolean(phone || whatsappHref || contactDetails.email);
  const missingDetails =
    !contactDetails.address ||
    !phone ||
    !contactDetails.whatsapp ||
    !contactDetails.email ||
    !contactDetails.hours;

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
              <span className="eyebrow">Contact Sky Voice</span>
              <h1 id="contact-title">Talk to the Sky Voice team.</h1>
              <p className="page-hero-lede">
                Questions about courses, fees, class timings, or the free assessment?
                Send an enquiry below, or book the free assessment directly.
              </p>
              <div className="hero-actions">
                {hasDirectContact ? (
                  <>
                    {phone ? (
                      <a className="button button-secondary button-large" href={`tel:${digits(phone)}`}>
                        <Phone aria-hidden="true" />
                        Call us
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
                        WhatsApp
                        <span className="sr-only"> (opens WhatsApp)</span>
                      </a>
                    ) : null}
                    {contactDetails.email ? (
                      <a
                        className="button button-secondary button-large"
                        href={`mailto:${contactDetails.email}`}
                      >
                        <Mail aria-hidden="true" />
                        Email
                      </a>
                    ) : null}
                  </>
                ) : (
                  <a className="button button-primary button-large" href="#enquiry-form">
                    Send an enquiry
                    <ArrowRight aria-hidden="true" />
                  </a>
                )}
                <Link className="button button-accent button-large" href={assessmentHref}>
                  Book my free assessment
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
              <span className="eyebrow">Contact information</span>
              <h2 id="details-title">{contactDetails.centreName}</h2>
              <dl className="contact-list">
                {contactDetails.address ? (
                  <DetailRow icon={MapPin} label="Office address">
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
                  <DetailRow icon={Phone} label={contactDetails.phones.length > 1 ? "Phone numbers" : "Phone"}>
                    {contactDetails.phones.map((number) => (
                      <a className="contact-link" href={`tel:${digits(number)}`} key={number}>
                        {number}
                      </a>
                    ))}
                  </DetailRow>
                ) : null}
                {whatsappHref && contactDetails.whatsapp ? (
                  <DetailRow icon={MessageCircle} label="WhatsApp">
                    <a className="contact-link" href={whatsappHref} rel="noopener noreferrer" target="_blank">
                      {contactDetails.whatsapp}
                      <span className="sr-only"> (opens WhatsApp)</span>
                    </a>
                  </DetailRow>
                ) : null}
                {contactDetails.email ? (
                  <DetailRow icon={Mail} label="Email">
                    <a className="contact-link" href={`mailto:${contactDetails.email}`}>
                      {contactDetails.email}
                    </a>
                  </DetailRow>
                ) : null}
                {contactDetails.hours ? (
                  <DetailRow icon={Clock3} label="Business hours">
                    {contactDetails.hours.map((line) => (
                      <span className="branch-address-line" key={line}>
                        {line}
                      </span>
                    ))}
                  </DetailRow>
                ) : null}
                {contactDetails.weeklyHoliday ? (
                  <DetailRow icon={CalendarOff} label="Weekly holiday">
                    {contactDetails.weeklyHoliday}
                  </DetailRow>
                ) : null}
              </dl>
              {missingDetails ? (
                <p className="contact-pending">
                  <Clock3 aria-hidden="true" />
                  <span>
                    {hasDirectContact
                      ? "Remaining contact details will be published once confirmed."
                      : "Phone, WhatsApp, email, and business hours will be published once Sky Voice confirms them. Until then, the enquiry form reaches the team."}
                  </span>
                </p>
              ) : null}

              <div className="contact-social">
                <h3>
                  <Share2 aria-hidden="true" /> Follow Sky Voice
                </h3>
                {socialLinks.length ? (
                  <ul className="social-list">
                    {socialLinks.map((link) => (
                      <li key={link.platform}>
                        <a
                          aria-label={`${socialLabels[link.platform]} (opens in a new tab)`}
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
                  <p className="muted-note">Official social profiles will be linked here once confirmed.</p>
                )}
              </div>
            </Reveal>
            <Reveal className="contact-form-wrap" delay={0.06}>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="locations-title" className="section locations-section">
          <div className="site-shell">
            <Reveal className="section-heading centered-heading">
              <span className="eyebrow">Office locations</span>
              <h2 id="locations-title">Find a Sky Voice office.</h2>
              {branches.length ? (
                <p>Choose a branch to see it on the map or get directions.</p>
              ) : null}
            </Reveal>
            {branches.length ? (
              <BranchLocations branches={branches} />
            ) : (
              <div className="pending-card">
                <Building2 aria-hidden="true" />
                <div>
                  <strong>Coaching is fully online.</strong>
                  <p>
                    Classes, practice, and feedback all happen online, so you can train
                    from anywhere. Any office or branch addresses will be listed here,
                    with maps and directions, once Sky Voice confirms them.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="contact-faq-title" className="section faq-section">
          <div className="site-shell faq-grid">
            <Reveal className="faq-intro">
              <span className="eyebrow">Before you write</span>
              <h2 id="contact-faq-title">Quick answers to common questions.</h2>
              <p>
                For questions about the course itself, the{" "}
                <Link className="text-link-inline" href={`${siteConfig.campaignPath}#faq`}>
                  coaching page FAQ
                </Link>{" "}
                covers format, timing, and the assessment in more detail.
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
