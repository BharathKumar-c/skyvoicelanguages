import { mkdir, readFile, rename, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";

import { cache } from "react";

import { getLocale } from "@/i18n/server";
import { localizeSettings } from "@/i18n/settings/localize";

import { defaultSettings } from "./defaults";
import { sampleContentEnabled, withSampleContent } from "./sample";
import {
  settingsSchema,
  settingsSections,
  type SettingsSection,
  type SiteSettings,
  type StoredSettings,
} from "./schema";

/**
 * Persistence for Website Settings. Server-only (uses the file system).
 *
 * The default store is one JSON document on the server's disk, written
 * atomically (temp file + rename) with the previous version kept as
 * `<file>.bak`. That suits a single Node server or VPS with a persistent disk.
 * Serverless hosts (e.g. Vercel) have no persistent disk: implement
 * `SettingsStore` against a database or KV store and return it from
 * `settingsStore()` — nothing else needs to change.
 */
export interface SettingsStore {
  read(): Promise<unknown | null>;
  write(document: StoredSettings): Promise<void>;
}

export function settingsFilePath() {
  return process.env.SETTINGS_FILE || path.join(process.cwd(), "data", "site-settings.json");
}

let warnedPath: string | null = null;

/**
 * A missing file normally just means "not saved yet". When SETTINGS_FILE is set
 * explicitly, though, a missing or non-JSON path is almost always a typo in the
 * env file (e.g. `SETTINGS_FILE=on` meant as `SAMPLE_CONTENT=on`), and the site
 * would silently fall back to the built-in defaults. Say so once in the log.
 */
function warnAboutConfiguredPath(file: string, missing: boolean) {
  if (!process.env.SETTINGS_FILE || warnedPath === file) return;
  if (!missing && file.toLowerCase().endsWith(".json")) return;
  warnedPath = file;
  console.warn(
    `[settings] SETTINGS_FILE is "${file}", which ${missing ? "does not exist" : "is not a .json file"}. ` +
      "The site is using built-in defaults. Check the SETTINGS_FILE line in .env.local.",
  );
}

const fileStore: SettingsStore = {
  async read() {
    const file = settingsFilePath();
    warnAboutConfiguredPath(file, false);
    try {
      // Runtime data, not source: keep the bundler from tracing the project.
      return JSON.parse(await readFile(/*turbopackIgnore: true*/ file, "utf8")) as unknown;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        warnAboutConfiguredPath(file, true);
        return null;
      }
      // Corrupt or unreadable: fall back to defaults rather than crash pages.
      console.error(`[settings] could not read ${settingsFilePath()}: ${(error as Error).message}`);
      return null;
    }
  },
  async write(document) {
    const file = settingsFilePath();
    await mkdir(/*turbopackIgnore: true*/ path.dirname(file), { recursive: true });
    await copyFile(/*turbopackIgnore: true*/ file, `${file}.bak`).catch(() => {});
    const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(/*turbopackIgnore: true*/ temp, `${JSON.stringify(document, null, 2)}\n`, "utf8");
    await rename(/*turbopackIgnore: true*/ temp, file);
  },
};

export function settingsStore(): SettingsStore {
  return fileStore;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Fills keys missing from `stored` with defaults (e.g. fields added later). */
function withDefaults(fallback: unknown, stored: unknown): unknown {
  if (!isPlainObject(fallback) || !isPlainObject(stored)) return stored === undefined ? fallback : stored;
  const merged: Record<string, unknown> = { ...stored };
  for (const [key, value] of Object.entries(fallback)) {
    merged[key] = key in stored ? withDefaults(value, stored[key]) : value;
  }
  return merged;
}

export type ResolvedSettings = {
  settings: SiteSettings;
  /** "defaults" until an administrator saves for the first time. */
  source: "defaults" | "saved";
  /** Sections that failed validation and are using built-in defaults. */
  fallbackSections: SettingsSection[];
  updatedAt: string | null;
  updatedBy: string | null;
};

/**
 * Built-in values from earlier releases. Saving Website Settings stores every
 * field, so a value still equal to an old default was never chosen by anyone:
 * it is treated as "not configured" and replaced by the current default.
 * Anything an administrator actually changed is kept.
 */
const legacyHeaderCta = { label: "Free assessment", href: "/free-ielts-assessment#assessment-form" };
const legacyFooterTagline =
  "Personalised online IELTS preparation for people with a real target and a reason to reach it.";

function upgradeLegacyDefaults(content: SiteSettings["content"]): SiteSettings["content"] {
  const next = { ...content };
  if (next.headerCtaLabel === legacyHeaderCta.label && next.headerCtaHref === legacyHeaderCta.href) {
    next.headerCtaLabel = defaultSettings.content.headerCtaLabel;
    next.headerCtaHref = defaultSettings.content.headerCtaHref;
  }
  if (next.footer.tagline === legacyFooterTagline) {
    next.footer = { ...next.footer, tagline: defaultSettings.content.footer.tagline };
  }
  return next;
}

/** Validates each section independently so one bad section cannot blank the site. */
export function resolveSettings(raw: unknown): ResolvedSettings {
  if (!isPlainObject(raw)) {
    return { fallbackSections: [], settings: defaultSettings, source: "defaults", updatedAt: null, updatedBy: null };
  }

  const fallbackSections: SettingsSection[] = [];
  const settings = { ...defaultSettings } as Record<SettingsSection, unknown>;
  for (const section of settingsSections) {
    if (!(section in raw)) continue;
    const parsed = settingsSchema.shape[section].safeParse(withDefaults(defaultSettings[section], raw[section]));
    if (parsed.success) settings[section] = parsed.data;
    else fallbackSections.push(section);
  }
  settings.content = upgradeLegacyDefaults(settings.content as SiteSettings["content"]);

  const meta = isPlainObject(raw.meta) ? raw.meta : {};
  return {
    fallbackSections,
    settings: settings as SiteSettings,
    source: "saved",
    updatedAt: typeof meta.updatedAt === "string" ? meta.updatedAt : null,
    updatedBy: typeof meta.updatedBy === "string" ? meta.updatedBy : null,
  };
}

/** Read once per request (React `cache`); never memoised across requests. */
export const getResolvedSettings = cache(async () => resolveSettings(await settingsStore().read()));

/**
 * Settings for the public site. With SAMPLE_CONTENT=on, empty fields are
 * filled with clearly labelled sample content (see ./sample.ts); the admin
 * editor reads getResolvedSettings() and never sees it.
 */
export async function getSettings() {
  const { settings } = await getResolvedSettings();
  const withSamples = sampleContentEnabled() ? withSampleContent(settings) : settings;
  // Built-in copy is shown in the visitor's language; saved custom text is kept as written.
  return localizeSettings(withSamples, await getLocale());
}

export async function saveSettings(settings: SiteSettings, updatedBy: string) {
  const document: StoredSettings = {
    ...settings,
    meta: { updatedAt: new Date().toISOString(), updatedBy },
  };
  await settingsStore().write(document);
  return document.meta!;
}
