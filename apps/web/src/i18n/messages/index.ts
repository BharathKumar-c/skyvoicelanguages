import type { Locale } from "../config";
import { withFallback, type DeepPartial } from "../merge";
import { en, type Messages } from "./en";
import { ta } from "./ta";

export type { ClientMessages, Messages } from "./en";

/** One entry per supported language; partial dictionaries fall back to English. */
const dictionaries: Record<Locale, DeepPartial<Messages>> = { en, ta };

const resolved = new Map<Locale, Messages>();

/** The full interface text for a language, with every missing entry filled from English. */
export function messagesFor(locale: Locale): Messages {
  let messages = resolved.get(locale);
  if (!messages) {
    messages = locale === "en" ? en : withFallback(en, dictionaries[locale]);
    resolved.set(locale, messages);
  }
  return messages;
}
