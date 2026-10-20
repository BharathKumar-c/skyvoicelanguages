import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The form endpoints rate-limit per client IP; give every test its own so
// repeated runs against one dev server do not hit the limit.
test.beforeEach(async ({ page }) => {
  const octet = () => Math.floor(Math.random() * 255);
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.${octet()}.${octet()}.${octet()}` });
});

test("about page renders its sections and marks the current page", async ({ page }) => {
  await page.goto("/about");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "IELTS coaching that starts with a diagnosis.",
  );
  await expect(page.getByRole("heading", { name: "Our mission, vision, and goals." })).toBeVisible();
  await expect(page.getByRole("heading", { name: /people who read every essay/ })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  if (await nav.isVisible()) {
    await expect(nav.getByRole("link", { name: "About Us" })).toHaveAttribute("aria-current", "page");
  }
});

test("contact form validates and submits an enquiry in preview mode", async ({ page }) => {
  await page.goto("/contact");

  const form = page.locator("#enquiry-form");
  await form.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(form.getByText("Enter a valid email address.")).toBeVisible();

  await form.getByLabel("Full name").fill("Asha Nair");
  await form.getByLabel("Email address").fill("asha@example.com");
  await form.getByLabel("Mobile number").fill("+91 98765 43210");
  await form.getByLabel("Enquiry about").selectOption("fees");
  await form.getByLabel("Message").fill("Do you have weekend batches for General Training?");
  await form.getByRole("button", { name: /Send enquiry/ }).click();

  await expect(form.getByText(/Preview validated successfully/)).toBeVisible();
  await expect(form.getByLabel("Full name")).toHaveValue("");
});

test("header links connect the homepage, IELTS & PTE, about, and contact pages", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation only");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await page.goto("/free-ielts-assessment");
  await nav.getByRole("link", { name: "About Us" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await nav.getByRole("link", { name: "IELTS & PTE" }).click();
  await expect(page).toHaveURL(/\/ielts-pte-coaching-chennai$/);
  await nav.getByRole("link", { name: "Contact Us" }).click();
  await expect(page).toHaveURL(/\/contact$/);
});

test("enquire now form validates and submits in preview mode", async ({ page }) => {
  await page.goto("/enquire-now");
  const form = page.locator("#enquire-form");
  await form.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(form.getByText("Enter your full name.")).toBeVisible();
  await expect(form.getByText("Enter your city.")).toBeVisible();

  await form.getByLabel("Full name").fill("Asha Nair");
  await form.getByLabel("WhatsApp number").fill("+91 98765 43210");
  await form.getByLabel("City").fill("Chennai");
  await form.getByLabel("Exam").selectOption("pte-academic");
  await form.getByLabel("Preferred format").selectOption("group");
  await form.getByRole("button", { name: /Send enquiry/ }).click();

  await expect(form.getByText(/Preview validated successfully/)).toBeVisible();
  await expect(form.getByLabel("Full name")).toHaveValue("");
});

test("IELTS & PTE page shows both exams, the comparison, and honest PTE fees", async ({ page }) => {
  await page.goto("/ielts-pte-coaching-chennai");
  await expect(page.locator("#ielts .pricing-card").first()).toContainText("IELTS Academic");
  await expect(page.getByRole("heading", { name: "PTE coaching in Chennai and online." })).toBeVisible();
  // No PTE fees are configured by default, so the page says so instead of inventing them.
  await expect(page.getByText("PTE packages and fees are being confirmed.")).toBeVisible();
  await expect(page.getByRole("table")).toContainText("10–90 points");
  await expect(page.getByText(/not official IELTS or PTE results/)).toBeVisible();
});

test("unverified proof stays hidden: no awards, countries, or sample content by default", async ({ page }) => {
  await page.goto("/why-choose-us");
  await expect(page.getByText("Verified results and recognition are on their way.")).toBeVisible();
  await expect(page.getByLabel("Awards and recognition")).toHaveCount(0);
  await expect(page.getByLabel("Countries our students join from")).toHaveCount(0);
  await expect(page.getByText(/Sample content preview/)).toHaveCount(0);
  await expect(page.getByText(/\(sample\)/)).toHaveCount(0);
});

test("homepage: the root URL opens the campaign homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/free-ielts-assessment$/);
  await expect(page.locator("#assessment-form")).toBeVisible();
});

test("homepage: Where IELTS can take you switches between pathways", async ({ page }) => {
  await page.goto("/free-ielts-assessment#destinations");
  const section = page.locator("#destinations");
  await expect(section.getByRole("heading", { name: "One score. Many doors." })).toBeVisible();
  await expect(section.getByRole("tab", { name: "Study abroad" })).toHaveAttribute("aria-selected", "true");
  await expect(section.getByText("Usually IELTS Academic")).toBeVisible();

  await section.getByRole("tab", { name: "Migrate & settle" }).click();
  await expect(section.getByRole("tab", { name: "Migrate & settle" })).toHaveAttribute("aria-selected", "true");
  await expect(section.getByText("Usually IELTS General Training")).toBeVisible();
  await expect(section.getByText("Visa routes (IELTS for UKVI)")).toBeVisible();

  // Arrow keys move between tabs.
  await section.getByRole("tab", { name: "Migrate & settle" }).press("ArrowLeft");
  await expect(section.getByRole("tab", { name: "Work & registration" })).toBeFocused();
  await expect(section.getByRole("tab", { name: "Work & registration" })).toHaveAttribute("aria-selected", "true");
});

test("homepage: success stories stay honest until consented stories exist", async ({ page }) => {
  await page.goto("/free-ielts-assessment#stories");
  const section = page.locator("#stories");
  await expect(section.getByRole("heading", { name: "Hear it from the students." })).toBeVisible();
  // The default settings hold no consented testimonials.
  const stories = section.getByRole("list", { name: "Student success stories" });
  if (await stories.count()) {
    await expect(stories.getByRole("listitem").first()).toBeVisible();
  } else {
    await expect(section.getByText("The first student stories are being collected.")).toBeVisible();
  }
});

for (const path of ["/free-ielts-assessment", "/about", "/contact", "/our-expertise", "/ielts-pte-coaching-chennai", "/why-choose-us", "/enquire-now", "/disclaimer"]) {
  test(`${path} has no automatically detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test(`${path} does not overflow a mobile viewport`, async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 });
    await page.goto(path);
    const sizes = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
  });
}
