import { defaultSettings } from "@/lib/settings/defaults";
import type { SiteSettings } from "@/lib/settings/schema";

import type { Locale } from "../config";
import type { DeepPartial } from "../merge";
import { taSettings } from "./ta";

/** Translations of the built-in Website Settings copy, per language. English needs none. */
const settingsTranslations: Partial<Record<Locale, DeepPartial<SiteSettings>>> = { ta: taSettings };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * True when every field that has a translation is still exactly the built-in
 * default. Fields without a translation (fees, flags, ids) are ignored, so a
 * changed fee does not stop a package's description from being translated.
 */
function isUnchanged(value: unknown, fallback: unknown, translation: unknown): boolean {
  if (translation === undefined || translation === null) return true;
  if (typeof value === "string") return value === fallback;
  if (Array.isArray(value)) {
    return (
      Array.isArray(fallback) &&
      Array.isArray(translation) &&
      value.length === fallback.length &&
      value.every((item, i) => isUnchanged(item, fallback[i], translation[i]))
    );
  }
  if (isPlainObject(value)) {
    return (
      isPlainObject(fallback) &&
      isPlainObject(translation) &&
      Object.entries(value).every(([key, item]) => isUnchanged(item, fallback[key], translation[key]))
    );
  }
  return true;
}

function localize(current: unknown, fallback: unknown, translation: unknown): unknown {
  if (translation === undefined || translation === null) return current;
  if (typeof current === "string") {
    return current === fallback && typeof translation === "string" && translation.trim() ? translation : current;
  }
  if (Array.isArray(current)) {
    if (!Array.isArray(fallback) || !Array.isArray(translation)) return current;
    return current.map((item, index) => {
      // A list item (an FAQ, a step) is translated only as a whole, so a
      // partly edited item never shows half English, half Tamil.
      if (index >= fallback.length || !isUnchanged(item, fallback[index], translation[index])) return item;
      return localize(item, fallback[index], translation[index]);
    });
  }
  if (isPlainObject(current)) {
    if (!isPlainObject(translation)) return current;
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(current)) {
      result[key] = localize(value, isPlainObject(fallback) ? fallback[key] : undefined, translation[key]);
    }
    return result;
  }
  return current;
}

/**
 * Shows the built-in Website Settings copy in the visitor's language. Text an
 * administrator has changed is kept exactly as saved (Website Settings has no
 * per-language fields yet).
 */
export function localizeSettings(settings: SiteSettings, locale: Locale): SiteSettings {
  const translation = settingsTranslations[locale];
  if (!translation) return settings;
  return localize(settings, defaultSettings, translation) as SiteSettings;
}
