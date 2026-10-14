import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the campaign promise and primary journey", async ({ page }) => {
  await page.goto("/free-ielts-assessment");

  await expect(
    page.getByRole("heading", { name: /Stuck at Band 5 or 6/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Your preparation should be personal/i }),
  ).toBeVisible();
  await expect(page.getByText("₹17,499")).toBeVisible();
  await expect(page.getByText("₹19,499")).toBeVisible();
});

test("shows accessible form errors and validates a preview lead", async ({ page }) => {
  await page.goto("/free-ielts-assessment");

  const form = page.locator("#assessment-form");
  await form.getByRole("button", { name: /Book my free assessment/i }).click();
  await expect(form.getByText("Enter your full name.")).toBeVisible();

  await form.getByLabel("Full name").fill("Asha Nair");
  await form.getByLabel("WhatsApp number").fill("+91 98765 43210");
  await form.getByLabel("City").fill("Kochi");
  await form.getByRole("button", { name: /Book my free assessment/i }).click();

  await expect(form.getByText(/Preview validated successfully/i)).toBeVisible();
});

test("has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/free-ielts-assessment");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("does not overflow a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/free-ielts-assessment");
  const sizes = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
});
