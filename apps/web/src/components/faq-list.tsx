"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { faqs } from "@/content/landing";

export function FaqList() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => {
        const isOpen = active === index;
        const contentId = `faq-answer-${index}`;

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
            <div className="faq-answer" hidden={!isOpen} id={contentId}>
              <p>{faq.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
