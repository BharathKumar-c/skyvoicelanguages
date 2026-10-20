import { expect, test } from "@playwright/test";

const menuItems = ["Home", "About Us", "Our Expertise", "IELTS & PTE", "Why Choose Us", "Contact Us"];
const campaign = "/free-ielts-assessment";

test("primary navigation lists the six site pages in order", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop navigation only");
  await page.goto("/about");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav.getByRole("link")).toHaveText(menuItems);
});

test("footer no longer links Method or Modules", async ({ page }) => {
  await page.goto("/contact");
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: "Method" })).toHaveCount(0);
  await expect(footer.getByRole("link", { name: "Modules" })).toHaveCount(0);
  await expect(footer.getByRole("link", { name: "Home" })).toHaveAttribute("href", campaign);
});

test("footer links Disclaimer, Privacy Policy, and Terms", async ({ page }) => {
  await page.goto("/about");
  const legal = page.getByRole("navigation", { name: "Legal" });
  await expect(legal.getByRole("link")).toHaveText(["Disclaimer", "Privacy Policy", "Terms"]);
  await legal.getByRole("link", { name: "Disclaimer" }).click();
  await expect(page).toHaveURL(/\/disclaimer$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Disclaimer");
});

test("each desktop menu item reaches its page", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation only");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });

  await page.goto("/contact");
  await nav.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${campaign}$`));
  await expect(page.locator("#assessment-form")).toBeVisible();

  for (const [label, path, heading] of [
    ["About Us", "/about", "IELTS coaching that starts with a diagnosis."],
    ["Our Expertise", "/our-expertise", "What we teach, and who teaches it."],
    ["IELTS & PTE", "/ielts-pte-coaching-chennai", "IELTS and PTE coaching for Chennai and beyond."],
    ["Why Choose Us", "/why-choose-us", "Why students choose Sky Voice."],
    ["Contact Us", "/contact", "Talk to the Sky Voice team."],
  ] as const) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
});

test("the root URL lands on the campaign page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(new RegExp(`${campaign}$`));
});

test("mobile menu opens, navigates, and closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation only");
  await page.goto("/about");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });

  await toggle.click();
  // The last link is the header button from Website Settings.
  await expect(menu.getByRole("link").filter({ hasNotText: /assessment|enquire|login/i })).toHaveText(menuItems);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();

  await page.getByRole("button", { name: "Open navigation" }).click();
  await menu.getByRole("link", { name: "Contact Us" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(menu).toBeHidden();
});

test("hero and plan CTAs scroll to the assessment form", async ({ page }) => {
  await page.goto(campaign);
  await page.getByRole("link", { name: /Book my free assessment/i }).first().click();
  await expect(page.locator("#assessment-form")).toBeInViewport();

  await page.goto(campaign);
  await page.getByRole("link", { name: "See how it works" }).click();
  await expect(page.locator("#method")).toBeInViewport();
});

for (const path of [
  campaign,
  "/about",
  "/contact",
  "/our-expertise",
  "/ielts-pte-coaching-chennai",
  "/why-choose-us",
  "/enquire-now",
  "/disclaimer",
  "/privacy",
  "/terms",
  "/thank-you",
]) {
  test(`${path} loads without console errors and fits a tablet viewport`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.setViewportSize({ height: 1024, width: 768 });
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    const sizes = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
    expect(errors).toEqual([]);
  });
}

test("unknown routes show the 404 page with a way back", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "Return to Sky Voice" }).click();
  await expect(page).toHaveURL(new RegExp(`${campaign}$`));
});

test.describe("Home on the home page", () => {
  const scrollY = (page: import("@playwright/test").Page) => page.evaluate(() => window.scrollY);
  // CSS locator: the closed mobile menu is display:none, which role queries skip.
  const homeIn = (page: import("@playwright/test").Page, isMobile: boolean) =>
    page.locator(isMobile ? "#mobile-menu a" : ".desktop-nav a").filter({ hasText: /^Home$/ });

  test("is active only at the top, not in Fees or other lower sections", async ({ page, isMobile }) => {
    await page.goto(campaign);
    await expect(homeIn(page, isMobile)).toHaveAttribute("aria-current", "page");

    await page.goto(`${campaign}#fees`);
    await expect(homeIn(page, isMobile)).not.toHaveAttribute("aria-current", /.*/);

    await page.locator("#video").scrollIntoViewIfNeeded();
    await expect(homeIn(page, isMobile)).not.toHaveAttribute("aria-current", /.*/);
  });

  test("clicking Home from Fees scrolls smoothly back to the top", async ({ page, isMobile }) => {
    await page.goto(`${campaign}#fees`);
    await expect(page.locator("#fees")).toBeInViewport();
    const start = await scrollY(page);
    expect(start).toBeGreaterThan(1000);

    if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
    await homeIn(page, isMobile).click();

    // Smooth: partway through, the page is between Fees and the top.
    await page.waitForTimeout(120);
    const midway = await scrollY(page);
    expect(midway).toBeGreaterThan(0);
    expect(midway).toBeLessThan(start);

    await expect.poll(() => scrollY(page)).toBe(0);
    await expect(page).toHaveURL(new RegExp(`${campaign}$`));
    await expect(homeIn(page, isMobile)).toHaveAttribute("aria-current", "page");
    if (isMobile) await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
  });

  test("respects reduced motion by jumping straight to the top", async ({ page, isMobile }) => {
    test.skip(isMobile, "Same behaviour on mobile; one viewport is enough");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${campaign}#faq`);
    await homeIn(page, false).click();
    await page.waitForTimeout(50);
    expect(await scrollY(page)).toBe(0);
  });

  test("the footer Home link also returns to the top", async ({ page }) => {
    await page.goto(campaign);
    await page.locator("footer").getByRole("link", { name: "Home" }).click();
    await expect.poll(() => scrollY(page)).toBe(0);
    await expect(page).toHaveURL(new RegExp(`${campaign}$`));
  });

  test("from another page, Home opens the home page at the top", async ({ page, isMobile }) => {
    await page.goto("/contact");
    if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
    await homeIn(page, isMobile).click();
    await expect(page).toHaveURL(new RegExp(`${campaign}$`));
    expect(await scrollY(page)).toBe(0);
    await expect(homeIn(page, isMobile)).toHaveAttribute("aria-current", "page");
  });
});

test("widening past the mobile layout closes the menu and unlocks scrolling", async ({ page, isMobile }) => {
  test.skip(isMobile, "Resizes the desktop viewport");
  await page.setViewportSize({ height: 900, width: 800 });
  await page.goto("/about");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator("#mobile-menu")).toHaveClass(/is-open/);
  await expect(page.locator("body")).toHaveAttribute("data-menu-open", "true");

  await page.setViewportSize({ height: 900, width: 1100 });
  await expect(page.locator("#mobile-menu")).not.toHaveClass(/is-open/);
  await expect(page.locator("body")).not.toHaveAttribute("data-menu-open", "true");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});

test("Student login stays hidden until the feature is approved", async ({ page, isMobile }) => {
  await page.goto("/ielts-pte-coaching-chennai");
  if (isMobile) await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("link", { name: /Student login/i })).toHaveCount(0);
  await expect(page.locator(".header-login, .mobile-login")).toHaveCount(0);
});
