import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultSettings } from "./defaults";
import { formatFee, whatsappHref } from "./format";
import { settingsSchema, testimonialSchema } from "./schema";
import { resolveSettings, saveSettings, settingsStore } from "./store";

const clone = () => structuredClone(defaultSettings);

describe("settings schema", () => {
  it("accepts the built-in defaults", () => {
    expect(settingsSchema.safeParse(defaultSettings).success).toBe(true);
  });

  it.each([
    ["contact.email", (s: ReturnType<typeof clone>) => (s.contact.email = "not-an-email")],
    ["contact.whatsapp", (s: ReturnType<typeof clone>) => (s.contact.whatsapp = "call me")],
    ["company.domain", (s: ReturnType<typeof clone>) => (s.company.domain = "skyvoicelanguages.com/")],
    ["courses.plans.0.academicFee", (s: ReturnType<typeof clone>) => (s.courses.plans[0].academicFee = "₹17,499")],
    ["company.logoUrl", (s: ReturnType<typeof clone>) => (s.company.logoUrl = "javascript:alert(1)")],
    ["content.hero.secondaryCtaHref", (s: ReturnType<typeof clone>) => (s.content.hero.secondaryCtaHref = "//evil.example")],
    ["integrations.analytics.ga4MeasurementId", (s: ReturnType<typeof clone>) => (s.integrations.analytics.ga4MeasurementId = "UA-1")],
    ["courses.plans", (s: ReturnType<typeof clone>) => (s.courses.plans = [])],
  ])("rejects an invalid %s", (field, mutate) => {
    const settings = clone();
    mutate(settings);
    const result = settingsSchema.safeParse(settings);
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toContain(field);
  });

  it("refuses to publish a testimonial without recorded consent", () => {
    const base = { from: "6.0", module: "Overall", name: "A Student", photoUrl: "", quote: "Clear plan.", to: "7.0" };
    expect(testimonialSchema.safeParse({ ...base, consent: false, published: true }).success).toBe(false);
    expect(testimonialSchema.safeParse({ ...base, consent: true, published: true }).success).toBe(true);
  });

  it("drops blank lines from one-per-line fields", () => {
    const settings = clone();
    settings.contact.phones = ["+91 98765 43210", "", ""];
    expect(settingsSchema.parse(settings).contact.phones).toEqual(["+91 98765 43210"]);
  });
});

describe("resolveSettings", () => {
  it("uses defaults when nothing is stored", () => {
    expect(resolveSettings(null)).toMatchObject({ settings: defaultSettings, source: "defaults" });
  });

  it("falls back per section when stored data is invalid", () => {
    const stored = { ...clone(), contact: { email: 42 } };
    stored.content.hero.titleLine1 = "Saved headline";
    const resolved = resolveSettings(stored);
    expect(resolved.fallbackSections).toEqual(["contact"]);
    expect(resolved.settings.contact).toEqual(defaultSettings.contact);
    expect(resolved.settings.content.hero.titleLine1).toBe("Saved headline");
  });

  it("fills fields added after the file was saved", () => {
    const stored = clone() as unknown as Record<string, Record<string, unknown>>;
    delete stored.courses.installmentInfo;
    delete stored.integrations;
    const resolved = resolveSettings(stored);
    expect(resolved.fallbackSections).toEqual([]);
    expect(resolved.settings.courses.installmentInfo).toBe("");
    expect(resolved.settings.integrations).toEqual(defaultSettings.integrations);
  });
});

describe("file store", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "sv-settings-"));
    vi.stubEnv("SETTINGS_FILE", path.join(dir, "nested", "settings.json"));
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    await rm(dir, { force: true, recursive: true });
  });

  it("returns null before the first save and round-trips afterwards", async () => {
    expect(await settingsStore().read()).toBeNull();
    const settings = clone();
    settings.contact.email = "hello@skyvoicelanguages.com";
    const meta = await saveSettings(settings, "admin");

    const resolved = resolveSettings(await settingsStore().read());
    expect(resolved.source).toBe("saved");
    expect(resolved.settings.contact.email).toBe("hello@skyvoicelanguages.com");
    expect(resolved).toMatchObject({ updatedAt: meta.updatedAt, updatedBy: "admin" });
  });

  it("keeps the previous version as a backup", async () => {
    const first = clone();
    first.contact.email = "first@skyvoicelanguages.com";
    await saveSettings(first, "admin");
    await saveSettings(clone(), "admin");
    const backup = JSON.parse(await readFile(`${process.env.SETTINGS_FILE}.bak`, "utf8"));
    expect(backup.contact.email).toBe("first@skyvoicelanguages.com");
  });

  it("treats a corrupt file as missing instead of crashing", async () => {
    await saveSettings(clone(), "admin");
    await writeFile(process.env.SETTINGS_FILE!, "{ not json", "utf8");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await settingsStore().read()).toBeNull();
  });
});

describe("format helpers", () => {
  it("formats rupee fees in the Indian grouping", () => {
    expect(formatFee("1749900")).toBe("₹17,49,900");
    expect(formatFee("")).toBeNull();
  });

  it("builds a wa.me link only when WhatsApp is enabled and set", () => {
    const settings = clone();
    expect(whatsappHref(settings)).toBeNull();
    settings.contact.whatsapp = "+91 98765 43210";
    expect(whatsappHref(settings)).toBe("https://wa.me/919876543210");
    settings.integrations.whatsapp.provider = "none";
    expect(whatsappHref(settings)).toBeNull();
  });
});
