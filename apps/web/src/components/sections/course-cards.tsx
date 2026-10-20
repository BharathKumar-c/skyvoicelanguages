import { ArrowRight, Check, MessagesSquare, Users } from "lucide-react";
import Link from "next/link";

import type { Messages } from "@/i18n/messages";
import { getMessages } from "@/i18n/server";
import { formatFee } from "@/lib/settings/format";
import type { SiteSettings } from "@/lib/settings/schema";

type Row = { label: string; fee: string };
type Card = {
  name: string;
  size: string;
  featured: boolean;
  rows: Row[];
  features: string[];
};

type Shared = Messages["shared"];

function PlanCards({ cards, ctaHref, ctaLabel, s }: { cards: Card[]; ctaHref: string; ctaLabel: string; s: Shared }) {
  return (
    <div className="pricing-grid">
      {cards.map((card) => (
        <div className={`pricing-card ${card.featured ? "is-featured" : ""}`} key={card.name}>
          {card.featured ? <span className="popular-badge">{s.mostFocused}</span> : null}
          <div className="pricing-title">
            <span>{card.featured ? <MessagesSquare aria-hidden="true" /> : <Users aria-hidden="true" />}</span>
            <div>
              <h3>{card.name}</h3>
              <p>{card.size}</p>
            </div>
          </div>
          <dl className="price-list">
            {card.rows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{formatFee(row.fee) ?? s.feeOnRequest}</dd>
              </div>
            ))}
          </dl>
          <ul className="plan-features">
            {card.features.filter(Boolean).map((feature) => (
              <li key={feature}>
                <Check aria-hidden="true" /> {feature}
              </li>
            ))}
          </ul>
          <Link className={`button ${card.featured ? "button-accent" : "button-secondary"}`} href={ctaHref}>
            {ctaLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      ))}
    </div>
  );
}

export async function IeltsCourseCards({ settings }: { settings: SiteSettings }) {
  const s = (await getMessages()).shared;
  const cards = settings.courses.plans.map((plan) => ({
    featured: plan.featured,
    features: [plan.description, plan.schedule, plan.duration, s.writingSpeakingFeedback],
    name: plan.name,
    rows: [
      { fee: plan.academicFee, label: s.ieltsAcademic },
      { fee: plan.generalFee, label: s.ieltsGeneral },
    ],
    size: plan.size,
  }));
  return <PlanCards cards={cards} ctaHref="/enquire-now" ctaLabel={s.enquireIelts} s={s} />;
}

/** The PTE products Sky Voice has confirmed, e.g. "PTE Academic and PTE Core". */
export function pteProducts(settings: SiteSettings, s: Shared) {
  const { offersAcademic, offersCore } = settings.courses.pte;
  const names = [offersAcademic ? s.pteAcademic : null, offersCore ? s.pteCore : null].filter(Boolean);
  return names.length ? names.join(s.and) : s.pte;
}

export async function PteCourseCards({ settings }: { settings: SiteSettings }) {
  const { plans } = settings.courses.pte;
  if (!plans.length) return null;
  const s = (await getMessages()).shared;
  const label = pteProducts(settings, s);
  const cards = plans.map((plan) => ({
    featured: plan.featured,
    features: [plan.description, plan.schedule, plan.duration],
    name: plan.name,
    rows: [{ fee: plan.fee, label }],
    size: plan.size,
  }));
  return <PlanCards cards={cards} ctaHref="/enquire-now" ctaLabel={s.enquirePte} s={s} />;
}
