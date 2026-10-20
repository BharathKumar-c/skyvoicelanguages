import { ArrowRight, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

import { AiraContext, AiraGroundShadow } from "@/components/mascot";
import { getMessages } from "@/i18n/server";

type AiraContextName = ComponentProps<typeof AiraContext>["context"];

/** Aira on the static orbit, as used beside inner-page heroes. */
export function ArtStage({
  context,
  shadow = 170,
  eager = false,
}: {
  context: AiraContextName;
  shadow?: number;
  eager?: boolean;
}) {
  return (
    <div className="feature-art-stage">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
      <img
        alt=""
        aria-hidden="true"
        className="feature-art-orbit"
        height={560}
        loading={eager ? undefined : "lazy"}
        src="/assets/generated/motion-graphics/hero-aira-orbit-stage-static.svg"
        width={480}
      />
      <div className="aira-figure">
        <AiraContext context={context} decorative eager={eager} />
        <AiraGroundShadow width={shadow} />
      </div>
    </div>
  );
}

/** Navy closing band with Enquire Now and a secondary action. */
export async function PageCta({
  id,
  title,
  body,
  secondary,
}: {
  id: string;
  title: string;
  body: string;
  secondary?: { href: string; label: string };
}) {
  const { shared } = await getMessages();
  const second = secondary ?? { href: "/contact", label: shared.askQuestion };
  return (
    <section aria-labelledby={id} className="page-cta">
      <div className="site-shell page-cta-inner">
        <div>
          <h2 id={id}>{title}</h2>
          <p>{body}</p>
        </div>
        <div className="page-cta-actions">
          <Link className="button button-accent button-large" href="/enquire-now">
            {shared.enquireNow}
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="button button-on-dark button-large" href={second.href}>
            <MessageCircleMore aria-hidden="true" />
            {second.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Serialised JSON-LD script; `<` is escaped so content cannot close the tag. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      type="application/ld+json"
    />
  );
}

/** Without JavaScript nothing reveals: show it all. */
export function RevealFallback() {
  return (
    <noscript>
      <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
    </noscript>
  );
}
