import { expect, test } from "@playwright/test";

import { DEMO, login, resetApi } from "./support";

test.beforeEach(async ({ request }) => resetApi(request));

test.describe("login", () => {
  test("rota privada sem sessão leva ao login preservando o destino", async ({ page }) => {
    await page.goto("/usuarios?search=ana");
    await expect(page).toHaveURL(/\/login\?next=%2Fusuarios%3Fsearch%3Dana/);
  });

  test("mostra Campo Obrigatório e o toast de credenciais inválidas", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("Campo Obrigatório")).toHaveCount(2);

    await page.getByLabel("Usuário").fill(DEMO.email);
    await page.getByLabel("Senha", { exact: true }).fill("errad1");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Usuário/Senha inválido(a)" }),
    ).toBeVisible();
  });

  test("entra por e-mail, mostra o toast e a Home com o nome", async ({ page }) => {
    await login(page);
    await expect(page.getByText("Olá Millena!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Menu de Millena Souza" })).toHaveText("MS");
  });

  test("entra pela matrícula e volta ao destino pedido", async ({ page }) => {
    await page.goto("/usuarios");
    await page.getByLabel("Usuário").fill(DEMO.registration);
    await page.getByLabel("Senha", { exact: true }).fill(DEMO.password);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("Usuário logado com sucesso!")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Usuários" })).toBeVisible({ timeout: 10_000 });
  });

  test("sair encerra a sessão", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: /Menu de/ }).click();
    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("tema escolhido persiste entre páginas", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: /Menu de/ }).click();
    await page.getByText("Escuro").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("recuperação de senha", () => {
  test("e-mail não cadastrado mostra o toast", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Esqueci minha senha" }).click();
    await page.getByLabel("E-mail").fill("ninguem@wenlock.com");
    await page.getByRole("button", { name: "Recuperar" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "E-mail não cadastrado" }),
    ).toBeVisible();
  });

  test("e-mail cadastrado abre o modal de e-mail enviado", async ({ page }) => {
    await page.goto("/recuperar-senha");
    await page.getByLabel("E-mail").fill(DEMO.email);
    await page.getByRole("button", { name: "Recuperar" }).click();
    await expect(page.getByRole("dialog", { name: "E-mail enviado!" })).toBeVisible();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redefine a senha pelo link e entra com a nova", async ({ page }) => {
    await page.goto("/redefinir-senha?token=token-valido");
    await page.getByLabel("Senha", { exact: true }).fill("nova12");
    await page.getByLabel("Repetir Senha").fill("nova12");
    await page.getByRole("button", { name: "Redefinir senha" }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.getByLabel("Usuário").fill(DEMO.email);
    await page.getByLabel("Senha", { exact: true }).fill("nova12");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible({ timeout: 10_000 });
  });
});
