import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export default function NotFound() {
  return (
    <main className="utility-page" id="main-content">
      <div className="utility-shell">
        <BrandLogo />
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG illustration */}
        <img
          alt=""
          aria-hidden="true"
          className="utility-illustration"
          height={360}
          loading="lazy"
          src="/assets/generated/illustrations/route-lost-404.svg"
          width={560}
        />
        <span className="eyebrow">404 · Page not found</span>
        <h1>This is not part of your IELTS route.</h1>
        <p>The page may have moved. Return to the free assessment guide and continue from there.</p>
        <Link className="button button-primary" href="/free-ielts-assessment">
          Return to Sky Voice
        </Link>
      </div>
    </main>
  );
}
