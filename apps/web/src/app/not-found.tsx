import Link from "next/link";

import { UtilityTop } from "@/components/utility-top";
import { getMessages } from "@/i18n/server";

export default async function NotFound() {
  const m = await getMessages();
  const t = m.notFound;
  return (
    <main className="utility-page" id="main-content">
      <div className="utility-shell">
        <UtilityTop homeLabel={m.client.nav.homeLink} linked={false} />
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
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <Link className="button button-primary" href="/">
          {t.back}
        </Link>
      </div>
    </main>
  );
}
