/**
 * Supported website languages. Everything that lists languages (the header
 * switcher, the <html lang> attribute, cookie validation) reads this list.
 *
 * To add a language: add an entry here, add `messages/<code>.ts` and
 * `settings/<code>.ts` (both may be partial — missing text falls back to
 * English), and register them in `messages/index.ts` and `settings/localize.ts`.
 */
export const locales = [
  { code: "en", label: "English", nativeName: "English", htmlLang: "en" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்", htmlLang: "ta" },
] as const;

export type Locale = (typeof locales)[number]["code"];

export const defaultLocale: Locale = "en";

/** Read by the server to render the chosen language; mirrored in localStorage. */
export const LOCALE_COOKIE = "sv_lang";
export const LOCALE_STORAGE_KEY = "sv_lang";
/** One year. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.some((locale) => locale.code === value);
}

export function localeInfo(code: Locale) {
  return locales.find((locale) => locale.code === code) ?? locales[0];
}
