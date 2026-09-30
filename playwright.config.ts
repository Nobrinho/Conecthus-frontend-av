import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3100;
const MOCK_API_PORT = 4010;
const isCI = !!process.env.CI;

const chromium = {
  ...devices["Desktop Chrome"],
  // Opcional: usar um Chromium já instalado na máquina em vez do baixado pelo Playwright.
  launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined },
};

/** Resoluções exigidas: celular, 720p, 1080p e 4K; cada uma nos temas claro e escuro. */
const viewports = {
  mobile: { width: 390, height: 844 },
  "720p": { width: 1280, height: 720 },
  "1080p": { width: 1920, height: 1080 },
  "4k": { width: 3840, height: 2160 },
} as const;

const responsiveProjects = Object.entries(viewports).flatMap(([name, viewport]) =>
  (["light", "dark"] as const).map((colorScheme) => ({
    name: `${name}-${colorScheme}`,
    testMatch: /responsive\.spec\.ts/,
    use: {
      ...chromium,
      viewport,
      colorScheme,
      ...(name === "mobile" ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}),
    },
  })),
);

export default defineConfig({
  testDir: "./e2e",
  // A API fake guarda estado em memória: os testes rodam em série e cada um
  // restaura os dados iniciais.
  fullyParallel: false,
  workers: 1,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    // Sem esperar a abertura animada do login e os fades dos toasts.
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "desktop",
      testIgnore: /responsive\.spec\.ts/,
      use: { ...chromium, viewport: viewports["1080p"] },
    },
    ...responsiveProjects,
  ],
  webServer: [
    {
      command: "node e2e/mock-api/server.mjs",
      url: `http://127.0.0.1:${MOCK_API_PORT}/api/v1/health`,
      env: { MOCK_API_PORT: String(MOCK_API_PORT) },
      reuseExistingServer: !isCI,
    },
    {
      // Build de produção apontando para a API fake. API_URL é lida em runtime
      // pelo servidor (Server Components, Server Actions e proxy).
      command: `npm run build && npx next start -p ${APP_PORT}`,
      url: `http://127.0.0.1:${APP_PORT}/api/health`,
      env: {
        API_URL: `http://127.0.0.1:${MOCK_API_PORT}/api/v1`,
        NEXT_PUBLIC_APP_URL: `http://127.0.0.1:${APP_PORT}`,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      timeout: 180_000,
      reuseExistingServer: !isCI,
    },
  ],
});
