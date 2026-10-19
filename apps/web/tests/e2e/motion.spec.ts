import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Animation behaviour with and without the visitor's reduced-motion setting
 * (Windows "Show animations" off reports `prefers-reduced-motion: reduce`).
 * Uses Playwright's media emulation, so no OS settings are changed.
 *
 * Policy under test (src/lib/motion.ts, "Reduced motion" in globals.css):
 * fades, colour and hover transitions keep their timing; travel, zoom and
 * looping movement become opacity-only or still; nothing stays hidden.
 */

const campaign = "/free-ielts-assessment";

/** Samples opacity and vertical offset while a Reveal section animates in. */
async function sampleReveal(page: Page, locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  const samples: { opacity: number; y: number }[] = [];
  for (let i = 0; i < 8; i += 1) {
    samples.push(
      await locator.evaluate((el) => {
        const transform = getComputedStyle(el).transform;
        const y = transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
        return { opacity: Number(getComputedStyle(el).opacity), y: Math.round(y * 10) / 10 };
      }),
    );
    await page.waitForTimeout(60);
  }
  return samples;
}

/** Scrolls the whole page so every scroll-triggered entrance fires. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += Math.round(innerHeight * 0.6)) {
      // "instant": the site's CSS smooth scrolling would otherwise lag behind the loop.
      window.scrollTo({ behavior: "instant", top: y });
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  });
  await page.waitForTimeout(900);
}

const firstPendingReveal = (page: Page) => page.locator("#method [data-reveal]").first();

test.describe("normal motion (prefers-reduced-motion: no-preference)", () => {
  test.use({ reducedMotion: "no-preference" });

  test("keeps the original entrances, loops and transitions", async ({ page }) => {
    await page.goto(campaign);
    await expect(page.locator(".hero-enter").first()).toHaveCSS("animation-name", "hero-enter");
    await expect(page.locator(".button").first()).toHaveCSS("transition-duration", /0\.18s/);
    await expect(page.locator(".faq-panel").first()).toHaveCSS("transition-duration", "0.22s");
    const ring = page.locator(".service-video-play-ring").first();
    await expect(ring).toHaveCSS("animation-name", "service-video-pulse");
    await expect(ring).toHaveCSS("animation-iteration-count", "infinite");
    await expect(page.locator(".audio-wave span").first()).toHaveCSS("animation-name", "portal-wave-bar");
    await expect(page.locator(".proof-float").first()).toHaveCSS("animation-name", "proof-float-bob");
  });

  test("scroll-in sections fade and rise", async ({ page }) => {
    await page.goto(campaign);
    const samples = await sampleReveal(page, firstPendingReveal(page));
    expect(samples.some((s) => s.opacity > 0.05 && s.opacity < 0.95), "fades gradually").toBe(true);
    expect(samples.some((s) => s.y > 1), "moves up while fading").toBe(true);
    expect(samples.at(-1)).toEqual({ opacity: 1, y: 0 });
  });
});

test.describe("reduced motion (prefers-reduced-motion: reduce)", () => {
  test.use({ reducedMotion: "reduce" });

  test("keeps fades and hover transitions at their normal timing", async ({ page }) => {
    await page.goto(campaign);
    // Hover/press and colour transitions are untouched (they were 0.01ms before the fix).
    await expect(page.locator(".button").first()).toHaveCSS("transition-duration", /0\.18s/);
    await expect(page.locator(".faq-panel").first()).toHaveCSS("transition-duration", "0.22s");
    // Hero entrance is kept as a fade (was disabled entirely).
    const hero = page.locator(".hero-enter").first();
    await expect(hero).toHaveCSS("animation-name", "hero-fade-in");
    await expect(hero).toHaveCSS("animation-duration", "0.6s");
  });

  test("replaces travel, zoom and ambient loops with opacity-only or still versions", async ({ page }) => {
    await page.goto(campaign);
    const ring = page.locator(".service-video-play-ring").first();
    await expect(ring).toHaveCSS("animation-name", "service-video-pulse-fade");
    await expect(ring).toHaveCSS("animation-iteration-count", "infinite");
    await expect(page.locator(".audio-wave span").first()).toHaveCSS("animation-name", "reduced-glow-pulse");
    await expect(page.locator(".proof-float").first()).toHaveCSS("animation-name", "none");
    // The loading spinner is essential feedback and keeps spinning.
    expect(
      await page.evaluate(() => {
        const probe = document.createElement("span");
        probe.className = "spin";
        document.body.append(probe);
        const name = getComputedStyle(probe).animationName;
        probe.remove();
        return name;
      }),
    ).toBe("spin");
  });

  test("scroll-in sections still fade, without moving", async ({ page }) => {
    await page.goto(campaign);
    const samples = await sampleReveal(page, firstPendingReveal(page));
    expect(samples.some((s) => s.opacity > 0.05 && s.opacity < 0.95), "fades gradually").toBe(true);
    for (const s of samples.filter((sample) => sample.opacity > 0)) expect(s.y, "no visible travel").toBe(0);
    expect(samples.at(-1)).toEqual({ opacity: 1, y: 0 });
  });

  test("the mobile assessment bar fades instead of sliding", async ({ page, isMobile }) => {
    test.skip(!isMobile, "The bar only shows on small screens");
    await page.goto(campaign);
    await expect(page.locator(".mobile-cta-bar")).toHaveCSS("transform", "none");
    await expect(page.locator(".mobile-cta-bar")).toHaveCSS("transition-duration", /0\.18s/);
  });
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test.describe(`content visibility (${reducedMotion})`, () => {
    test.use({ reducedMotion });

    for (const path of [campaign, "/about", "/contact"]) {
      test(`${path}: nothing stays hidden after scrolling`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(message.text());
        });

        await page.goto(path);
        await scrollThrough(page);

        const hidden = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>("[data-reveal], .hero-enter")]
            .filter((el) => Number(getComputedStyle(el).opacity) < 0.99)
            .map((el) => el.className || el.tagName),
        );
        expect(hidden).toEqual([]);

        // Connector lines end fully drawn (normal) or faded in (reduced).
        const lines = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>(".route-line, .method-line")].map((el) => ({
            clip: getComputedStyle(el).clipPath,
            opacity: getComputedStyle(el).opacity,
          })),
        );
        for (const line of lines) {
          expect(line.opacity).toBe("1");
          expect(line.clip).toMatch(/inset\(0(px|%)?\)|none/);
        }
        expect(errors, "no runtime or hydration errors").toEqual([]);
      });
    }
  });
}

test("follows a reduced-motion change made while the page is open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(campaign);
  await expect(page.locator(".hero-enter").first()).toHaveCSS("animation-name", "hero-enter");

  // The visitor switches Windows "Show animations" off mid-session.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-enter").first()).toHaveCSS("animation-name", "hero-fade-in");
  await expect(page.locator(".service-video-play-ring").first()).toHaveCSS(
    "animation-name",
    "service-video-pulse-fade",
  );
  // Motion components pick it up too: the next section fades in without rising.
  const samples = await sampleReveal(page, firstPendingReveal(page));
  expect(samples.some((s) => s.opacity > 0.05 && s.opacity < 0.95)).toBe(true);
  for (const s of samples.filter((sample) => sample.opacity > 0)) expect(s.y).toBe(0);

  // And back again.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".service-video-play-ring").first()).toHaveCSS("animation-name", "service-video-pulse");
});
