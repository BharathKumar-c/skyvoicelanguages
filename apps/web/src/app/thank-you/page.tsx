import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Clock3, Map, MessageCircleMore } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Assessment request received",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="utility-page" id="main-content">
      <div className="utility-shell success-shell">
        <Link aria-label="Sky Voice Languages home" href="/">
          <BrandLogo />
        </Link>
        <span className="success-icon">
          <CheckCircle2 aria-hidden="true" />
        </span>
        <span className="eyebrow">Request received</span>
        <h1>Your IELTS roadmap starts here.</h1>
        <p>
          Thank you. The next step is to arrange your online assessment slot and learn
          which modules deserve your attention first.
        </p>
        <div className="thank-you-steps">
          <div>
            <MessageCircleMore aria-hidden="true" />
            <strong>Watch for the WhatsApp message</strong>
            <span>The team will use the number from your form.</span>
          </div>
          <div>
            <Clock3 aria-hidden="true" />
            <strong>Set aside 45 minutes</strong>
            <span>Your assessment looks across all four modules.</span>
          </div>
          <div>
            <Map aria-hidden="true" />
            <strong>Receive a written roadmap</strong>
            <span>Know the priorities, format, and next step.</span>
          </div>
        </div>
        <Link className="button button-primary" href="/free-ielts-assessment">
          Return to the IELTS guide
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
