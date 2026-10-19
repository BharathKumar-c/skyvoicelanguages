import { defineConfig, devices, type Project } from "@playwright/test";

// PLAYWRIGHT_BASE_URL runs the suite against an already-running server, e.g. a
// production build: `next start -p 3101` then PLAYWRIGHT_BASE_URL=http://127.0.0.1:3101.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

// Optional extra browsers for the cross-browser suites, e.g.
// PW_BROWSERS=msedge (installed Microsoft Edge) or PW_BROWSERS=firefox,webkit
// (after `npx playwright install firefox webkit`).
const extraBrowsers: Record<string, Project["use"]> = {
  firefox: { ...devices["Desktop Firefox"] },
  msedge: { ...devices["Desktop Edge"], channel: "msedge" },
  webkit: { ...devices["Desktop Safari"] },
  "mobile-safari": { ...devices["iPhone 14"] },
};
const extraProjects: Project[] = (process.env.PW_BROWSERS ?? "")
  .split(",")
  .map((name) => name.trim())
  .filter((name) => name in extraBrowsers)
  .map((name) => ({
    name,
    testMatch: /(motion|navigation|landing|pages)\.spec\.ts/,
    use: extraBrowsers[name],
  }));

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "pnpm dev",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
      },
  projects: [
    // Edits the shared settings file, so it runs first, alone, and restores it.
    { name: "admin", testMatch: /admin\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
    {
      dependencies: ["admin"],
      name: "chromium",
      testIgnore: /admin\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      dependencies: ["admin"],
      name: "mobile-chrome",
      testIgnore: /admin\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
    ...extraProjects,
  ],
});
