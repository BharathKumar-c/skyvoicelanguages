import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
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
  ],
});
