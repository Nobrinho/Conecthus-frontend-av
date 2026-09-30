import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

import { login, resetApi } from "./support";

/**
 * Roda em todos os projetos de viewport × tema (ver playwright.config.ts):
 * cada tela precisa caber sem rolagem horizontal e passar no axe (WCAG 2 AA,
 * que inclui contraste de cores no tema claro e no escuro).
 */
async function checkScreen(page: Page, name: string) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `${name}: rolagem horizontal`).toBeLessThanOrEqual(0);

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    // Logotipos são isentos de contraste (WCAG 1.4.3). O logo já é exposto
    // como imagem com nome acessível, então fica fora da análise.
    .exclude("[data-logo]")
    .analyze();
  expect(
    violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
    `${name}: violações de acessibilidade`,
  ).toEqual([]);

  await test.info().attach(name, {
    body: await page.screenshot({ fullPage: true }),
    contentType: "image/png",
  });
}

test.beforeEach(async ({ request }) => resetApi(request));

test("telas públicas", async ({ page }) => {
  await page.goto("/login");
  // Espera a splash sair antes de medir.
  await page.waitForTimeout(1800);
  await checkScreen(page, "login");

  await page.goto("/recuperar-senha");
  await checkScreen(page, "recuperar-senha");
});

test("telas logadas", async ({ page }) => {
  await login(page);
  await page.waitForTimeout(500);
  await checkScreen(page, "home");

  await page.goto("/usuarios");
  await checkScreen(page, "usuarios");

  await page.goto("/usuarios/cadastro");
  await checkScreen(page, "cadastro");

  await page.goto("/usuarios?search=zzzz");
  await checkScreen(page, "sem-resultado");
});
