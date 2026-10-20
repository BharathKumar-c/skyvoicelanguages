import { cookies } from "next/headers";
import { cache } from "react";

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { messagesFor } from "./messages";

/**
 * The visitor's language, from the cookie the language switcher sets. Server
 * only. Reading the cookie makes pages render per request, which is what lets
 * the same URL show English or Tamil.
 */
export const getLocale = cache(async (): Promise<Locale> => {
  try {
    const value = (await cookies()).get(LOCALE_COOKIE)?.value;
    return isLocale(value) ? value : defaultLocale;
  } catch {
    // Outside a request (e.g. a unit test): use the default language.
    return defaultLocale;
  }
});

/** All interface text for the visitor's language, with English fallbacks filled in. */
export const getMessages = cache(async () => messagesFor(await getLocale()));
