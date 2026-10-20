import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

import { getMessages } from "@/i18n/server";

import { UtilityTop } from "./utility-top";

type LegalDoc = "privacy" | "terms" | "disclaimer";

export async function legalMetadata(doc: LegalDoc): Promise<Metadata> {
  const t = (await getMessages()).legal[doc];
  return { title: t.metaTitle, description: t.metaDescription };
}

/** Privacy, Terms, and Disclaimer: one layout, text from the interface dictionaries. */
export async function LegalPage({ doc }: { doc: LegalDoc }) {
  const m = await getMessages();
  const t = m.legal[doc];

  return (
    <main className="utility-page legal-page" id="main-content">
      <article className="utility-shell legal-shell">
        <UtilityTop homeLabel={m.client.nav.homeLink} />
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p className="legal-updated">{t.updated}</p>
        {t.intro ? <p>{t.intro}</p> : null}
        {t.sections.map((section) => (
          <Fragment key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Fragment>
        ))}
        <Link className="button button-secondary" href="/free-ielts-assessment">
          {doc === "disclaimer" ? m.legal.backHome : m.legal.backAssessment}
        </Link>
      </article>
    </main>
  );
}
