"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useTransition } from "react";

import {
  isLocale,
  localeInfo,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./config";
import type { ClientMessages } from "./messages";

type I18nContextValue = {
  locale: Locale;
  /** Text for interactive components, already merged with English fallbacks. */
  m: ClientMessages;
  setLocale: (locale: Locale) => void;
  /** True while the server re-renders the page in the new language. */
  switching: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage blocked (private mode): the cookie alone still remembers the choice.
  }
}

function readCookieLocale(): Locale | null {
  const value = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
    ?.slice(LOCALE_COOKIE.length + 1);
  return isLocale(value) ? value : null;
}

/**
 * Provides the current language to client components and switches it.
 *
 * Switching stores the choice (cookie for the server, localStorage as a
 * backup), updates <html lang>, and refreshes the current route so server
 * components re-render in the new language. The URL, scroll position, and any
 * text typed into forms stay as they are.
 */
export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: ClientMessages;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [switching, startTransition] = useTransition();
  // Latest values for callbacks, so their identity stays stable across renders.
  const latest = useRef({ locale, router });
  useEffect(() => {
    latest.current = { locale, router };
  });

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next);
    document.documentElement.lang = localeInfo(next).htmlLang;
    if (next === latest.current.locale) return;
    startTransition(() => latest.current.router.refresh());
  }, []);

  // Runs when the page's language changes (first load, or after a switch).
  // The cookie is the source of truth; localStorage mirrors it, and restores
  // the choice if the cookie was cleared.
  useEffect(() => {
    const cookie = readCookieLocale();
    if (cookie) {
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, cookie);
      } catch {
        // Ignore: the cookie already remembers the choice.
      }
      return;
    }
    const stored = readStoredLocale();
    if (stored && stored !== locale) setLocale(stored);
  }, [locale, setLocale]);

  const value = useMemo(() => ({ locale, m: messages, setLocale, switching }), [locale, messages, setLocale, switching]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** The current language and its interface text. Must be used inside <I18nProvider> (the root layout). */
export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>.");
  return value;
}
