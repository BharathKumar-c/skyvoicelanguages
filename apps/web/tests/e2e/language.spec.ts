import { expect, test, type Page } from "@playwright/test";

// The form endpoints rate-limit per client IP; give every test its own.
test.beforeEach(async ({ page }) => {
  const octet = () => Math.floor(Math.random() * 255);
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.${octet()}.${octet()}.${octet()}` });
});

const globe = (page: Page) => page.getByRole("button", { name: /Change language|மொழியை மாற்றவும்/ }).first();

async function choose(page: Page, language: "English" | "தமிழ்") {
  await globe(page).click();
  await page.getByRole("menuitemradio", { name: language }).click();
}

test("English is the default and <html lang> says so", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(globe(page)).toHaveAccessibleName("Change language. Current language: English EN");
  await expect(globe(page)).toHaveAttribute("aria-expanded", "false");
});

test("switching to Tamil translates the page in place, persists, and switches back", async ({ page, isMobile }) => {
  await page.goto("/about");
  await choose(page, "தமிழ்");

  // Same page, now in Tamil.
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ta");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("நோயறிதலுடன் தொடங்கும் IELTS பயிற்சி.");
  await expect(globe(page)).toHaveAccessibleName("மொழியை மாற்றவும். தற்போதைய மொழி: தமிழ் TA");

  // Survives a refresh and navigation to another page.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ta");
  await page.goto("/contact");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sky Voice குழுவுடன் பேசுங்கள்.");
  if (!isMobile) {
    // Tamil footer links too.
    await expect(page.locator("footer").getByRole("link", { name: "தனியுரிமைக் கொள்கை" })).toBeVisible();
  }

  // And back to English.
  await choose(page, "English");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Talk to the Sky Voice team.");
});

test("the menu works with the keyboard and closes on Escape or an outside click", async ({ page }) => {
  await page.goto("/privacy");
  await globe(page).focus();
  await page.keyboard.press("Enter");
  const items = page.getByRole("menuitemradio");
  await expect(items).toHaveText(["English", "தமிழ்"]);
  await expect(items.first()).toBeFocused();
  await expect(items.first()).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("ArrowDown");
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(globe(page)).toBeFocused();

  await globe(page).click();
  await expect(page.getByRole("menu")).toBeVisible();
  // A spot away from the menu (on phones the menu covers the heading).
  await page.mouse.click(8, page.viewportSize()!.height - 8);
  await expect(page.getByRole("menu")).toHaveCount(0);
});

test("switching keeps typed form text and shows validation messages in the new language", async ({ page }) => {
  await page.goto("/enquire-now");
  const form = page.locator("#enquire-form");
  await form.getByLabel("Full name").fill("Asha Nair");
  await form.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(form.getByText("Enter your city.")).toBeVisible();

  await choose(page, "தமிழ்");
  await expect(page.locator("html")).toHaveAttribute("lang", "ta");
  await expect(form.getByLabel("முழுப் பெயர்")).toHaveValue("Asha Nair");
  await expect(form.getByText("உங்கள் நகரத்தை உள்ளிடவும்.")).toBeVisible();

  // Submitting in Tamil: the server's reply is in Tamil too (preview mode in development).
  await form.getByLabel("WhatsApp எண்").fill("+91 98765 43210");
  await form.getByLabel("நகரம்").fill("Chennai");
  await form.getByRole("button", { name: /விசாரணையை அனுப்பு/ }).click();
  await expect(form.getByText(/முன்னோட்டச் சரிபார்ப்பு வெற்றிகரமாக முடிந்தது/)).toBeVisible();

  await choose(page, "English");
});

test("Tamil pages fit a phone screen without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ height: 800, width: 360 });
  await page.goto("/why-choose-us");
  await choose(page, "தமிழ்");
  for (const path of ["/free-ielts-assessment", "/about", "/ielts-pte-coaching-chennai", "/why-choose-us", "/enquire-now"]) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", "ta");
    const sizes = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(sizes.scroll, path).toBeLessThanOrEqual(sizes.client);
  }
  await choose(page, "English");
});

test("Tamil: the wider hamburger range closes its menu when the desktop menu returns", async ({ page, isMobile }) => {
  test.skip(isMobile, "Resizes the desktop viewport");
  await page.setViewportSize({ height: 900, width: 1000 });
  await page.goto("/about");
  await choose(page, "தமிழ்");
  await page.getByRole("button", { name: "வழிசெலுத்தல் பட்டியைத் திறக்கவும்" }).click();
  await expect(page.locator("#mobile-menu")).toHaveClass(/is-open/);

  await page.setViewportSize({ height: 900, width: 1300 });
  await expect(page.locator("#mobile-menu")).not.toHaveClass(/is-open/);
  await expect(page.locator("body")).not.toHaveAttribute("data-menu-open", "true");
});
