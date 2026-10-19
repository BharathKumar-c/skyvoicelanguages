"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FaqItem = { question: string; answer: string };

/** Accessible accordion; items come from Website Settings. */
export function FaqList({
  items,
  idPrefix = "faq",
}: {
  items: readonly FaqItem[];
  idPrefix?: string;
}) {
  const [active, setActive] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((faq, index) => {
        const isOpen = active === index;
        const contentId = `${idPrefix}-answer-${index}`;

        return (
          <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={faq.question}>
            <h3>
              <button
                aria-controls={contentId}
                aria-expanded={isOpen}
                onClick={() => setActive(isOpen ? null : index)}
                type="button"
              >
                <span>{faq.question}</span>
                <ChevronDown aria-hidden="true" />
              </button>
            </h3>
            {/* Always rendered so the height can animate; inert while closed keeps
                it out of the tab order and the accessibility tree. */}
            <div className="faq-panel" id={contentId} inert={!isOpen}>
              <div className="faq-answer">
                <div className="faq-answer-inner">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
