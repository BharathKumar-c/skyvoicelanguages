import Link from "next/link";

import { siteConfig } from "@/config/site";

import { BrandLogo } from "./brand-logo";

const campaign = siteConfig.campaignPath;

/** Shared footer for the campaign, About, and Contact pages. */
export function SiteFooter() {
  return (
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
            <Link href={`${campaign}#method`}>Method</Link>
            <Link href={`${campaign}#modules`}>Modules</Link>
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
        <p>© {new Date().getFullYear()} Sky Voice Languages.</p>
        <p>
          Sky Voice is an independent coaching provider. IELTS is jointly owned by the
          British Council, IDP: IELTS Australia, and Cambridge University Press &amp;
          Assessment. Results vary by student effort and starting level.
        </p>
      </div>
    </footer>
  );
}
