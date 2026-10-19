import { Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { brandLogos, telDigits, whatsappHref } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";

import { BrandLogo } from "./brand-logo";
import { HomeLink } from "./home-link";
import { SocialIcon, socialLabels } from "./social-icon";

const campaign = siteConfig.campaignPath;

/** Shared footer; company copy and contact details come from Website Settings. */
export async function SiteFooter() {
  const settings = await getSettings();
  const { company, contact, content } = settings;
  const phone = contact.phones[0];
  const whatsapp = whatsappHref(settings);

  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div className="footer-brand">
          <BrandLogo src={brandLogos(settings).white} variant="white" />
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
                    WhatsApp
                    <span className="sr-only"> (opens WhatsApp)</span>
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
                    aria-label={`${socialLabels[link.platform]} (opens in a new tab)`}
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
            <strong>Explore</strong>
            <HomeLink href={campaign}>Home</HomeLink>
            <Link href={`${campaign}#portal`}>Portal</Link>
            <Link href={`${campaign}#fees`}>Fees</Link>
          </div>
          <div>
            <strong>Support</strong>
            <Link href="/about">About us</Link>
            <Link href="/contact">Contact</Link>
            <Link href={`${campaign}#faq`}>FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="site-shell footer-bottom">
        <p>
          © {new Date().getFullYear()} {company.name}.
        </p>
        <p>{content.footer.disclaimer}</p>
      </div>
    </footer>
  );
}
