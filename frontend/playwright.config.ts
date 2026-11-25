import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    // next-intl negotiates `/` from Accept-Language; pin Hebrew so the default
    // (unprefixed) locale is what the specs exercise (.plan/017 known e2e break).
    locale: "he-IL",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], locale: "he-IL" },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      CONTACT_INQUIRY_DELIVERY_MODE: "simulate",
    },
  },
});
