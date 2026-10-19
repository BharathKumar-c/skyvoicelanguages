import { expect, test, type Page } from "@playwright/test";

// The form endpoints rate-limit per client IP; give every test its own.
const uniqueIp = () => `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": uniqueIp() });
});

async function fillLead(page: Page, formId: string) {
  const form = page.locator(formId);
  await form.getByLabel("Full name").fill("Asha Nair");
  await form.getByLabel("WhatsApp number").fill("+91 98765 43210");
  await form.getByLabel("City").fill("Kochi");
  await form.getByLabel("IELTS type").selectOption("general");
  await form.getByLabel("Target band").selectOption("7.5");
  return form;
}

test("assessment form shows every required-field error", async ({ page }) => {
  await page.goto("/free-ielts-assessment");
  const form = page.locator("#assessment-form");
  await form.getByLabel("WhatsApp number").fill("please call me");
  await form.getByRole("button", { name: /Book my free assessment/i }).click();
  await expect(form.getByText("Enter your full name.")).toBeVisible();
  await expect(form.getByText("Use digits and an optional country code.")).toBeVisible();
  await expect(form.getByText("Enter your city.")).toBeVisible();
  await expect(form.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
});

test("the closing assessment form submits too", async ({ page }) => {
  await page.goto("/free-ielts-assessment");
  const form = await fillLead(page, "#final-assessment-form");
  await form.getByRole("button", { name: /Book my free assessment/i }).click();
  await expect(form.getByText(/Preview validated successfully/i)).toBeVisible();
});

test("assessment form sends the details and campaign attribution", async ({ page }) => {
  await page.goto("/free-ielts-assessment?utm_source=meta&utm_campaign=oct");
  const form = await fillLead(page, "#assessment-form");
  const [request] = await Promise.all([
    page.waitForRequest("**/api/leads"),
    form.getByRole("button", { name: /Book my free assessment/i }).click(),
  ]);
  expect(request.postDataJSON()).toMatchObject({
    city: "Kochi",
    ieltsType: "general",
    name: "Asha Nair",
    sourcePage: "/free-ielts-assessment",
    targetBand: "7.5",
    utmCampaign: "oct",
    utmSource: "meta",
  });
});

test("a live success goes to the thank-you page", async ({ page }) => {
  await page.route("**/api/leads", (route) =>
    route.fulfill({ json: { message: "Assessment request received.", mode: "live" } }),
  );
  await page.goto("/free-ielts-assessment");
  const form = await fillLead(page, "#assessment-form");
  await form.getByRole("button", { name: /Book my free assessment/i }).click();
  await expect(page).toHaveURL(/\/thank-you\?submitted=1$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your IELTS roadmap starts here.");
});

test("a non-JSON server error shows a readable message", async ({ page }) => {
  await page.route("**/api/leads", (route) =>
    route.fulfill({ body: "<html>Bad gateway</html>", contentType: "text/html", status: 502 }),
  );
  await page.goto("/free-ielts-assessment");
  const form = await fillLead(page, "#assessment-form");
  await form.getByRole("button", { name: /Book my free assessment/i }).click();
  await expect(form.getByRole("alert")).toHaveText("We could not send your request. Please try again.");
});

test("a network failure on the contact form shows a readable message", async ({ page }) => {
  await page.route("**/api/enquiries", (route) => route.abort("internetdisconnected"));
  await page.goto("/contact");
  const form = page.locator("#enquiry-form");
  await form.getByLabel("Full name").fill("Asha Nair");
  await form.getByLabel("Email address").fill("asha@example.com");
  await form.getByLabel("Mobile number").fill("+91 98765 43210");
  await form.getByLabel("Message").fill("Do you run weekend batches?");
  await form.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(form.getByRole("alert")).toContainText("could not reach the server");
  await expect(form.getByLabel("Full name")).toHaveValue("Asha Nair");
});

test("contact form validates every field", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("#enquiry-form");
  await form.getByLabel("Email address").fill("not-an-email");
  await form.getByLabel("Message").fill("short");
  await form.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(form.getByText("Enter your full name.")).toBeVisible();
  await expect(form.getByText("Enter a valid email address.")).toBeVisible();
  await expect(form.getByText("Enter a mobile number with country code.")).toBeVisible();
  await expect(form.getByText(/at least 10 characters/)).toBeVisible();
});

test.describe("form APIs", () => {
  const lead = {
    city: "Kochi",
    ieltsType: "academic",
    name: "Asha Nair",
    phone: "+91 98765 43210",
    targetBand: "7.0",
  };
  const enquiry = {
    email: "asha@example.com",
    enquiryType: "fees",
    message: "Do you have weekend batches?",
    name: "Asha Nair",
    phone: "+91 98765 43210",
  };

  for (const [path, body] of [
    ["/api/leads", lead],
    ["/api/enquiries", enquiry],
  ] as const) {
    test(`${path} rejects malformed and invalid input`, async ({ request }) => {
      const headers = { "x-forwarded-for": uniqueIp() };
      const malformed = await request.post(path, {
        data: "{not json",
        headers: { ...headers, "Content-Type": "application/json" },
      });
      expect(malformed.status()).toBe(400);
      const invalid = await request.post(path, { data: { ...body, name: "" }, headers });
      expect(invalid.status()).toBe(400);
    });

    test(`${path} silently accepts a filled honeypot`, async ({ request }) => {
      const response = await request.post(path, {
        data: { ...body, website: "spam.example" },
        headers: { "x-forwarded-for": uniqueIp() },
      });
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({ mode: "live" });
    });

    test(`${path} rate-limits a client after five attempts`, async ({ request }) => {
      const headers = { "x-forwarded-for": uniqueIp() };
      const statuses: number[] = [];
      for (let attempt = 0; attempt < 6; attempt += 1) {
        statuses.push((await request.post(path, { data: { ...body, name: "" }, headers })).status());
      }
      expect(statuses).toEqual([400, 400, 400, 400, 400, 429]);
    });
  }
});
