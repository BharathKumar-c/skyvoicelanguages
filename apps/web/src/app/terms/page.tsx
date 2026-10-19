import type { Metadata } from "next";
import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";

export const metadata: Metadata = {
  title: "Website terms",
  description: "Terms for using the Sky Voice Languages IELTS website.",
};

export default function TermsPage() {
  return (
    <main className="utility-page legal-page" id="main-content">
      <article className="utility-shell legal-shell">
        <Link aria-label="Sky Voice Languages home" href="/">
          <SiteLogo />
        </Link>
        <span className="eyebrow">Terms</span>
        <h1>Website terms</h1>
        <p className="legal-updated">Last updated: 13 October 2026</p>
        <p>
          This website describes Sky Voice IELTS assessment and coaching services. The
          final commercial terms, schedules, access periods, cancellation rules, and
          verified business contact details must be approved before enrolment is taken.
        </p>
        <h2>No score guarantee</h2>
        <p>
          IELTS outcomes vary according to starting level, attendance, practice,
          feedback completion, exam conditions, and individual performance. Nothing on
          this website guarantees a particular band score.
        </p>
        <h2>Fees and availability</h2>
        <p>
          Displayed fees and format descriptions should be reconfirmed before purchase.
          A free assessment does not require enrolment in a paid course.
        </p>
        <h2>IELTS trademark</h2>
        <p>
          Sky Voice is an independent coaching provider. IELTS is jointly owned by the
          British Council, IDP: IELTS Australia, and Cambridge University Press &amp;
          Assessment. These organizations do not endorse this independent website.
        </p>
        <h2>Acceptable use</h2>
        <p>
          Do not misuse the website, attempt to disrupt its operation, submit false
          enquiries, or reproduce protected materials without permission.
        </p>
        <Link className="button button-secondary" href="/free-ielts-assessment">
          Back to the assessment page
        </Link>
      </article>
    </main>
  );
}
