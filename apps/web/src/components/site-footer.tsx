import { Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { format } from "@/i18n/merge";
import { getMessages } from "@/i18n/server";
import { brandLogos, studentPortalUrl, telDigits, whatsappHref } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";

import { BrandLogo } from "./brand-logo";
import { HomeLink } from "./home-link";
import { SocialIcon, socialLabels } from "./social-icon";

const campaign = siteConfig.campaignPath;

/** Shared footer; company copy and contact details come from Website Settings. */
export async function SiteFooter() {
  const [settings, { footer: t, client }] = await Promise.all([getSettings(), getMessages()]);
  const { company, contact, content } = settings;
  const phone = contact.phones[0];
  const whatsapp = whatsappHref(settings);

  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div className="footer-brand">
          <BrandLogo src={brandLogos(settings).white} variant="white" />
          {company.tagline ? <p className="footer-tagline">{company.tagline}</p> : null}
          <p>{content.footer.tagline}</p>
          {phone || whatsapp || contact.email ? (
            <ul className="footer-contact">
              {phone ? (
                <li>
                  <a href={`tel:${telDigits(phone)}`}>
                    <Phone aria-hidden="true" />
                    {phone}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a href={whatsapp} rel="noopener noreferrer" target="_blank">
                    <MessageCircle aria-hidden="true" />
                    {t.whatsapp}
                    <span className="sr-only">{client.common.opensWhatsapp}</span>
                  </a>
                </li>
              ) : null}
              {contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`}>
                    <Mail aria-hidden="true" />
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
          {company.socialLinks.length ? (
            <ul className="footer-social">
              {company.socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    aria-label={`${socialLabels[link.platform]}${client.common.opensNewTab}`}
                    href={link.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="footer-links">
          <div>
            <strong>{t.explore}</strong>
            <HomeLink href={campaign}>{t.home}</HomeLink>
            <Link href="/ielts-pte-coaching-chennai">{t.ieltsPte}</Link>
            <Link href="/our-expertise">{t.expertise}</Link>
            <Link href="/why-choose-us">{t.why}</Link>
            <Link href={`${campaign}#fees`}>{t.fees}</Link>
            {studentPortalUrl(settings) ? <a href={studentPortalUrl(settings)}>{t.studentLogin}</a> : null}
          </div>
          <div>
            <strong>{t.support}</strong>
            <Link href="/about">{t.about}</Link>
            <Link href="/contact">{t.contact}</Link>
            <Link href="/enquire-now">{t.enquire}</Link>
            <Link href={`${campaign}#faq`}>{t.faq}</Link>
          </div>
        </div>
      </div>
      <div className="site-shell footer-bottom">
        <p>{format(t.copyright, { company: company.name, year: new Date().getFullYear() })}</p>
        <nav aria-label={t.legal} className="footer-legal">
          <Link href="/disclaimer">{t.disclaimer}</Link>
          <Link href="/privacy">{t.privacy}</Link>
          <Link href="/terms">{t.terms}</Link>
        </nav>
        <p>
          {content.footer.disclaimer}
          {content.footer.pteDisclaimer ? ` ${content.footer.pteDisclaimer}` : null}
        </p>
      </div>
    </footer>
  );
}
