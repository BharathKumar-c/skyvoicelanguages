import type { Metadata } from "next";
import { ArrowRight, Clock3, Map, MessageCircleMore } from "lucide-react";
import Link from "next/link";

import { AnimatedArt } from "@/components/animated-art";
import { AiraContext, AiraGroundShadow } from "@/components/mascot";
import { UtilityTop } from "@/components/utility-top";
import { getMessages } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { thankYou } = await getMessages();
  return { title: thankYou.metaTitle, robots: { index: false, follow: false } };
}

const stepIcons = [MessageCircleMore, Clock3, Map];

export default async function ThankYouPage() {
  const m = await getMessages();
  const t = m.thankYou;

  return (
    <main className="utility-page" id="main-content">
      <div className="utility-shell success-shell">
        <UtilityTop homeLabel={m.client.nav.homeLink} />
        <div className="thank-you-mascot">
          <AnimatedArt
            className="thank-you-burst"
            height={600}
            src="/assets/generated/motion-graphics/celebration-spark-burst.svg"
            staticSrc="/assets/generated/motion-graphics/celebration-spark-burst-static.svg"
            width={600}
          />
          <div className="aira-figure">
            <AiraContext aria-label={t.airaLabel} context="thank-you" eager size="xl" />
            <AiraGroundShadow width={180} />
          </div>
        </div>
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <div className="thank-you-steps">
          {t.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <div key={step.title}>
                <Icon aria-hidden="true" />
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </div>
            );
          })}
        </div>
        <Link className="button button-primary" href="/free-ielts-assessment">
          {t.back}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
