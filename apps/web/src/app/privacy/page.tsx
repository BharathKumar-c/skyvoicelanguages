import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Sky Voice Languages handles IELTS assessment enquiry details.",
};

export default function PrivacyPage() {
  return (
    <main className="utility-page legal-page" id="main-content">
      <article className="utility-shell legal-shell">
        <Link aria-label="Sky Voice Languages home" href="/">
          <BrandLogo />
        </Link>
        <span className="eyebrow">Privacy</span>
        <h1>Privacy notice</h1>
        <p className="legal-updated">Last updated: 13 October 2026</p>
        <p>
          This notice explains the data used by the Sky Voice IELTS assessment enquiry
          experience. It should be reviewed alongside the final lead provider and
          operational contact details before production launch.
        </p>
        <h2>Information you provide</h2>
        <p>
          The assessment form asks for your name, WhatsApp number, city, IELTS type,
          and target band. Campaign attribution data may also be attached to understand
          which page or advertisement led to the enquiry.
        </p>
        <h2>Why it is used</h2>
        <p>
          The information is used to respond to your request, arrange an assessment,
          understand your stated IELTS goal, and recommend the appropriate next step.
          Personal details must not be sent to advertising analytics platforms.
        </p>
        <h2>Service providers</h2>
        <p>
          Sky Voice may use secure hosting, messaging, analytics, and spam-prevention
          providers. The final provider list, retention period, and privacy contact will
          be published before live lead collection begins.
        </p>
        <h2>Your choices</h2>
        <p>
          You may ask the Sky Voice team to correct or delete enquiry information using
          the verified contact channel that will be displayed on the live website.
        </p>
        <Link className="button button-secondary" href="/free-ielts-assessment">
          Back to the assessment page
        </Link>
      </article>
    </main>
  );
}
