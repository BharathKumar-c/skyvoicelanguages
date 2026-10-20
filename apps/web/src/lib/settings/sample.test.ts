import { afterEach, describe, expect, it, vi } from "vitest";

import { organizationLd } from "@/lib/seo/json-ld";

import { defaultSettings } from "./defaults";
import { sampleContentEnabled, sampleSettings, withSampleContent } from "./sample";
import { awardSchema, settingsSchema } from "./schema";
import { resolveSettings } from "./store";
import { publicProof } from "./trainers";

const clone = () => structuredClone(defaultSettings);

describe("new settings fields", () => {
  it("back-fills fields added after a settings file was saved", () => {
    const stored = clone() as Record<string, unknown>;
    delete stored.pages;
    const results = stored.results as Record<string, unknown>;
    delete results.awards;
    delete results.countries;
    const resolved = resolveSettings(stored);
    expect(resolved.fallbackSections).toEqual([]);
    expect(resolved.settings.pages).toEqual(defaultSettings.pages);
    expect(resolved.settings.results.awards).toEqual([]);
  });

  it("upgrades an untouched old header button and footer tagline to the current defaults", () => {
    const stored = clone();
    stored.content.headerCtaLabel = "Free assessment";
    stored.content.headerCtaHref = "/free-ielts-assessment#assessment-form";
    stored.content.footer.tagline =
      "Personalised online IELTS preparation for people with a real target and a reason to reach it.";
    const { settings } = resolveSettings(stored);
    expect([settings.content.headerCtaLabel, settings.content.headerCtaHref]).toEqual(["Enquire Now", "/enquire-now"]);
    expect(settings.content.footer.tagline).toBe(defaultSettings.content.footer.tagline);
  });

  it("keeps a header button an administrator chose", () => {
    const stored = clone();
    stored.content.headerCtaLabel = "Book a call";
    stored.content.headerCtaHref = "/contact";
    expect(resolveSettings(stored).settings.content.headerCtaLabel).toBe("Book a call");
  });

  it("refuses to publish an award that is not verified", () => {
    const award = { evidenceNote: "", issuer: "Body", title: "Award", year: "2025" };
    expect(awardSchema.safeParse({ ...award, published: true, verified: false }).success).toBe(false);
    expect(awardSchema.safeParse({ ...award, published: true, verified: true }).success).toBe(true);
  });

  it("ships with no tagline, awards, countries, PTE fees, or learning-style claims", () => {
    expect(defaultSettings.company.tagline).toBe("");
    expect(defaultSettings.results.awards).toEqual([]);
    expect(defaultSettings.results.countries.verified).toBe(false);
    expect(defaultSettings.courses.pte.plans).toEqual([]);
    expect(defaultSettings.pages.home.learningPoints).toEqual([]);
  });
});

describe("sample content", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is off unless SAMPLE_CONTENT is switched on", () => {
    for (const value of ["", "off", "false", "0"]) {
      vi.stubEnv("SAMPLE_CONTENT", value);
      expect(sampleContentEnabled()).toBe(false);
    }
    for (const value of ["on", "ON", " true ", "1", "yes"]) {
      vi.stubEnv("SAMPLE_CONTENT", value);
      expect(sampleContentEnabled()).toBe(true);
    }
  });

  it("labels every visible placeholder as sample data", () => {
    const merged = withSampleContent(clone());
    expect(merged.company.tagline).toMatch(/sample/i);
    expect(merged.team.trainers.every((trainer) => /sample/i.test(trainer.name))).toBe(true);
    expect(merged.results.testimonials.every((story) => /sample/i.test(story.name))).toBe(true);
    expect(merged.results.awards.every((award) => /sample/i.test(award.title))).toBe(true);
    expect(merged.results.countries.list.every((country) => /\(sample\)/.test(country))).toBe(true);
    expect(merged.courses.pte.plans.every((plan) => /\(sample\)/.test(plan.name))).toBe(true);
    expect(merged.company.socialLinks.length).toBeGreaterThan(0);
    expect(merged.company.portalUrl).toContain("example.com");
  });

  it("fills only empty fields and keeps anything an administrator saved", () => {
    const settings = clone();
    settings.contact.email = "real@skyvoicelanguages.com";
    settings.team.trainers = [{ ...sampleSettings.team!.trainers![0], id: "real", name: "Real Tutor" }];
    const merged = withSampleContent(settings);

    expect(merged.contact.email).toBe("real@skyvoicelanguages.com");
    expect(merged.team.trainers.map((trainer) => trainer.name)).toEqual(["Real Tutor"]);
    expect(merged.company.tagline).toBe(sampleSettings.company!.tagline);
    expect(merged.results.awards.length).toBeGreaterThan(0);
    expect(merged.courses.pte.offersAcademic).toBe(true);
    // Defaults with real copy are not replaced.
    expect(merged.pages.whyChooseUs).toEqual(defaultSettings.pages.whyChooseUs);
  });

  it("produces settings that still pass validation", () => {
    expect(settingsSchema.safeParse(withSampleContent(clone())).success).toBe(true);
  });
});

describe("public proof", () => {
  it("shows nothing by default", () => {
    expect(publicProof(clone())).toEqual({ awards: [], countries: [], stats: [], testimonials: [] });
  });

  it("ignores unverified countries", () => {
    const settings = withSampleContent(clone());
    expect(publicProof(settings).countries.length).toBeGreaterThan(0);
    settings.results.countries.verified = false;
    expect(publicProof(settings).countries).toEqual([]);
  });

  it("adds a postal address to the organisation only when one is configured", () => {
    expect(organizationLd(clone())).not.toHaveProperty("address");
    expect(organizationLd(withSampleContent(clone()))).toHaveProperty("address");
  });
});
