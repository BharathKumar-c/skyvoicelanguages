import { describe, expect, it } from "vitest";

import { defaultSettings } from "@/lib/settings/defaults";

import { isLocale, locales } from "./config";
import { format, withFallback } from "./merge";
import { messagesFor } from "./messages";
import { en } from "./messages/en";
import { ta } from "./messages/ta";
import { localizeSettings } from "./settings/localize";
import { taSettings } from "./settings/ta";

type Tree = Record<string, unknown> | unknown[] | string;

/** Every leaf path ("a.b.0.c") and its value. */
function leaves(value: unknown, prefix = ""): [string, unknown][] {
  if (Array.isArray(value)) return value.flatMap((item, i) => leaves(item, `${prefix}${i}.`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => leaves(item, `${prefix}${key}.`));
  }
  return [[prefix.slice(0, -1), value]];
}

const at = (tree: unknown, path: string) =>
  path.split(".").reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], tree as Tree);

describe("fallback merging", () => {
  const base = { title: "Hello", list: ["a", "b"], nested: { body: "Body" } };

  it("uses the translation where present and English where missing or blank", () => {
    expect(withFallback(base, { title: "வணக்கம்", nested: { body: "  " } })).toEqual({
      title: "வணக்கம்",
      list: ["a", "b"],
      nested: { body: "Body" },
    });
  });

  it("ignores a translated list whose length does not match", () => {
    expect(withFallback(base, { list: ["only one"] }).list).toEqual(["a", "b"]);
  });

  it("fills placeholders and leaves unknown ones as written", () => {
    expect(format("{count} of {total} — {other}", { count: 2, total: 5 })).toBe("2 of 5 — {other}");
  });
});

describe("dictionaries", () => {
  it("lists English and Tamil, with English first as the default", () => {
    expect(locales.map((locale) => locale.code)).toEqual(["en", "ta"]);
    expect(isLocale("ta")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("only uses keys that exist in English (no stray or misspelled keys)", () => {
    const unknown = leaves(ta).filter(([path]) => at(en, path) === undefined);
    expect(unknown.map(([path]) => path)).toEqual([]);
  });

  it("keeps every translated list the same length as the English list", () => {
    const mismatched = leaves(ta)
      .map(([path]) => path.split(".").slice(0, -1))
      .flatMap((parts) => parts.map((_, i) => parts.slice(0, i + 1).join(".")))
      .filter((path, i, all) => all.indexOf(path) === i)
      .filter((path) => Array.isArray(at(ta, path)))
      .filter((path) => (at(ta, path) as unknown[]).length !== (at(en, path) as unknown[]).length);
    expect(mismatched).toEqual([]);
  });

  it("resolves every Tamil entry to non-empty text, falling back to English where untranslated", () => {
    const resolved = messagesFor("ta");
    for (const [path, value] of leaves(en)) {
      if (value === "") continue; // intentionally empty in English too
      expect(typeof at(resolved, path), path).toBe("string");
      expect((at(resolved, path) as string).length, path).toBeGreaterThan(0);
    }
    // A key Tamil does not translate (test names stay in English) falls back.
    expect(resolved.client.enquireForm.examOptions["ielts-academic"]).toBe("IELTS Academic");
    // A translated key is used.
    expect(resolved.client.nav.home).toBe("முகப்பு");
  });

  it("keeps English unchanged", () => {
    expect(messagesFor("en")).toBe(en);
  });

  it("keeps placeholders in Tamil text that the English text uses", () => {
    const resolved = messagesFor("ta");
    for (const [path, value] of leaves(en)) {
      if (typeof value !== "string") continue;
      const placeholders = value.match(/\{\w+\}/g) ?? [];
      for (const placeholder of placeholders) {
        expect(at(resolved, path) as string, path).toContain(placeholder);
      }
    }
  });
});

describe("Website Settings localisation", () => {
  it("shows built-in copy in Tamil", () => {
    const settings = localizeSettings(structuredClone(defaultSettings), "ta");
    expect(settings.content.hero.titleLine1).toBe(taSettings.content!.hero!.titleLine1);
    expect(settings.content.faqs[0].question).toBe(taSettings.content!.faqs![0].question);
    expect(settings.content.headerCtaLabel).toBe("இப்போதே விசாரிக்கவும்");
    // Non-text settings are untouched.
    expect(settings.courses.plans[0].academicFee).toBe("17499");
  });

  it("keeps text an administrator changed, exactly as written", () => {
    const custom = structuredClone(defaultSettings);
    custom.content.hero.titleLine1 = "Aiming for Band 7?";
    custom.content.faqs[1].answer = "A custom answer.";
    const settings = localizeSettings(custom, "ta");
    expect(settings.content.hero.titleLine1).toBe("Aiming for Band 7?");
    // The rest of the hero is still the default, so it is translated.
    expect(settings.content.hero.titleLine2).toBe(taSettings.content!.hero!.titleLine2);
    // A partly edited FAQ stays entirely in its saved language.
    expect(settings.content.faqs[1]).toEqual(custom.content.faqs[1]);
    expect(settings.content.faqs[0].question).toBe(taSettings.content!.faqs![0].question);
  });

  it("still translates a package's wording when only its fee was changed", () => {
    const custom = structuredClone(defaultSettings);
    custom.courses.plans[0].academicFee = "21000";
    const settings = localizeSettings(custom, "ta");
    expect(settings.courses.plans[0].description).toBe(taSettings.courses!.plans![0].description);
    expect(settings.courses.plans[0].academicFee).toBe("21000");
  });

  it("leaves English settings unchanged", () => {
    const settings = structuredClone(defaultSettings);
    expect(localizeSettings(settings, "en")).toBe(settings);
  });

  it("keeps the Tamil hero underline at the end of the second line", () => {
    const hero = taSettings.content!.hero!;
    expect(hero.titleLine2!.endsWith(hero.titleUnderline!)).toBe(true);
  });
});
