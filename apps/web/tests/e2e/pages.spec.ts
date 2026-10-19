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

test("header links connect the campaign, about, and contact pages", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation only");
  await page.goto("/free-ielts-assessment");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "About Us" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Contact Us" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Fees" }).click();
  await expect(page).toHaveURL(/\/free-ielts-assessment#fees$/);
});

for (const path of ["/about", "/contact"]) {
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
