import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3100;
const MOCK_API_PORT = 4010;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Opcional: usar um Chromium já instalado na máquina em vez do baixado pelo Playwright.
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
        },
      },
    },
  ],
  webServer: [
    {
      command: "node e2e/mock-api/server.mjs",
      url: `http://127.0.0.1:${MOCK_API_PORT}/health`,
      env: { MOCK_API_PORT: String(MOCK_API_PORT) },
      reuseExistingServer: !isCI,
    },
    {
      // Build de produção: NEXT_PUBLIC_* é embutido no build, então o app já sai apontando para a API fake.
      command: `npm run build && npm run start -- -p ${APP_PORT}`,
      url: `http://127.0.0.1:${APP_PORT}/api/health`,
      env: {
        NEXT_PUBLIC_API_URL: `http://127.0.0.1:${MOCK_API_PORT}`,
        NEXT_PUBLIC_APP_URL: `http://127.0.0.1:${APP_PORT}`,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      timeout: 180_000,
      reuseExistingServer: !isCI,
    },
  ],
});
