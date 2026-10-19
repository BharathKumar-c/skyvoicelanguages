import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

/**
 * Website Settings end to end. Runs in its own Playwright project before the
 * other suites (see playwright.config.ts) because it edits the shared settings
 * file; the original file is restored afterwards.
 *
 * Credentials come from apps/web/.env.local (ADMIN_USERNAME / ADMIN_PASSWORD,
 * development only). Without them the suite is skipped.
 */

function readEnvLocal() {
  return readFile(path.join(process.cwd(), ".env.local"), "utf8")
    .then((text) =>
      Object.fromEntries(
        text
          .split(/\r?\n/)
          .map((line) => line.match(/^([A-Z_]+)=(.*)$/))
          .filter((match): match is RegExpMatchArray => Boolean(match))
          .map((match) => [match[1], match[2]]),
      ),
    )
    .catch(() => ({}) as Record<string, string>);
}

// Must match the server: SETTINGS_FILE (env, then .env.local), else the app's default.
let settingsFile = path.join(process.cwd(), "data", "site-settings.json");
let saved: { file: string | null; bak: string | null } = { bak: null, file: null };
let credentials = { password: "", username: "admin" };

const readIfExists = (file: string) => readFile(file, "utf8").catch(() => null);
const restore = async (file: string, content: string | null) =>
  content === null ? rm(file, { force: true }) : writeFile(file, content, "utf8");

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  const env = await readEnvLocal();
  credentials = { password: env.ADMIN_PASSWORD ?? "", username: env.ADMIN_USERNAME || "admin" };
  // Same precedence as Next.js: a real environment variable beats .env.local.
  const configured = (process.env.SETTINGS_FILE || env.SETTINGS_FILE || "").trim();
  if (configured) settingsFile = configured;
  // Keep the real settings (and their .bak) in memory; the suite starts from defaults.
  saved = { bak: await readIfExists(`${settingsFile}.bak`), file: await readIfExists(settingsFile) };
  await rm(settingsFile, { force: true });
});

test.afterAll(async () => {
  await restore(settingsFile, saved.file);
  await restore(`${settingsFile}.bak`, saved.bak);
});

test.beforeEach(async ({ page }) => {
  test.skip(!credentials.password, "ADMIN_PASSWORD not set in .env.local");
  const octet = () => Math.floor(Math.random() * 255);
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.${octet()}.${octet()}.${octet()}` });
});

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(credentials.username);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin\/settings$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Website Settings");
}

const tab = (page: Page, name: string) => page.getByRole("tab", { name });
const panel = (page: Page) => page.locator('[role="tabpanel"]:not([hidden])');

test("unauthenticated visitors cannot reach settings", async ({ page, context }) => {
  await page.goto("/admin/settings");
  await expect(page).toHaveURL(/\/admin\/login$/);

  // A forged session cookie is rejected too.
  const forged = Buffer.from(JSON.stringify({ exp: Date.now() + 1e9, user: "admin" })).toString("base64url");
  await context.addCookies([{ name: "sv_admin_session", url: "http://127.0.0.1:3000", value: `${forged}.fake` }]);
  await page.goto("/admin/settings");
  await expect(page).toHaveURL(/\/admin\/login$/);

  const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
  expect(robots).toContain("noindex");
});

test("wrong credentials show an error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(credentials.username);
  await page.getByLabel("Password").fill("definitely-wrong");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.locator(".admin-notice")).toHaveText("That username and password do not match.");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("invalid input is rejected with field messages and nothing is saved", async ({ page }) => {
  await signIn(page);
  await expect(page.getByText("Showing built-in defaults — nothing saved yet.")).toBeVisible();

  await tab(page, "Contact").click();
  await panel(page).getByLabel("Contact email").fill("not-an-email");
  await panel(page).getByLabel("WhatsApp number").fill("call me");
  await tab(page, "Results & reviews").click();
  await panel(page).getByRole("button", { name: "Add testimonial" }).click();
  await panel(page).getByLabel("Student name").fill("A Student");
  await panel(page).getByLabel("Quote").fill("The roadmap was clear.");
  await panel(page).getByLabel("Published").check();
  await page.getByRole("button", { name: "Save settings" }).click();

  await expect(page.locator(".admin-notice.is-error")).toContainText("Nothing was saved");
  await expect(tab(page, "Contact")).toHaveAttribute("aria-selected", "true");
  await expect(panel(page).getByText("Enter a valid email address.")).toBeVisible();
  await expect(panel(page).getByText(/Use digits with an optional \+ country code/)).toBeVisible();
  await tab(page, "Results & reviews").click();
  await expect(panel(page).getByText("Record the student's written consent before publishing.")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Showing built-in defaults — nothing saved yet.")).toBeVisible();
});

test("saved settings persist and appear on the public pages", async ({ page }) => {
  await signIn(page);

  await tab(page, "Contact").click();
  await panel(page).getByLabel("Phone numbers").fill("+91 98765 43210");
  await panel(page).getByLabel("WhatsApp number").fill("+91 91234 56789");
  await panel(page).getByLabel("Contact email").fill("hello@skyvoicelanguages.com");
  await panel(page).getByLabel("Business hours").fill("Mon–Sat · 9:00–19:00");

  await tab(page, "Courses & fees").click();
  await panel(page).getByLabel("IELTS Academic fee (₹)").first().fill("21000");
  await panel(page).getByLabel("Portal access duration").fill("6 months");

  await tab(page, "Website content").click();
  await panel(page).getByLabel("Headline, first line").fill("Aiming for Band 7?");

  await tab(page, "Results & reviews").click();
  await panel(page).getByRole("button", { name: "Add statistic" }).click();
  await panel(page).getByLabel("Value").fill("99+");
  await panel(page).getByLabel("Label").fill("unverified figure");

  await expect(page.getByText("Unsaved changes")).toBeVisible();
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.locator(".admin-notice.is-success")).toContainText("Settings saved");
  await expect(page.getByText("All changes saved")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save settings" })).toBeDisabled();

  // Persistence across a reload.
  await page.reload();
  await expect(page.getByText(/Last saved .* by /)).toBeVisible();
  await tab(page, "Contact").click();
  await expect(panel(page).getByLabel("Contact email")).toHaveValue("hello@skyvoicelanguages.com");

  // Contact page and footer.
  await page.goto("/contact");
  await expect(page.locator('main a[href="tel:+919876543210"]').first()).toBeVisible();
  await expect(page.locator('main a[href="https://wa.me/919123456789"]').first()).toBeVisible();
  await expect(page.locator('main a[href="mailto:hello@skyvoicelanguages.com"]').first()).toBeVisible();
  await expect(page.getByText("Mon–Sat · 9:00–19:00")).toBeVisible();
  await expect(page.locator("footer").getByRole("link", { name: "+91 98765 43210" })).toBeVisible();

  // Campaign page.
  await page.goto("/free-ielts-assessment");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Aiming for Band 7?");
  await expect(page.getByText("₹21,000")).toBeVisible();
  await expect(page.getByText("Portal access: 6 months.")).toBeVisible();

  // An unverified statistic stays private.
  await page.goto("/about");
  await expect(page.getByText("unverified figure")).toHaveCount(0);
  await expect(page.getByText("Verified results are on their way.")).toBeVisible();
});

test("the editor works on a phone-sized screen and signing out locks it again", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await signIn(page);
  const sizes = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/admin/settings");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("secrets never reach the browser", async ({ page }) => {
  const env = await readEnvLocal();
  await signIn(page);
  const html = await page.content();
  for (const key of ["ADMIN_PASSWORD", "ADMIN_SESSION_SECRET", "SMTP_PASS", "WATI_API_TOKEN"]) {
    const value = env[key];
    if (value) expect(html).not.toContain(value);
  }
  await expect(page.getByText("Configured").or(page.getByText("Not configured")).first()).toBeAttached();
});
