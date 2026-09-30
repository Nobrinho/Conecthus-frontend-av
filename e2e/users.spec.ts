import { expect, type Page, test } from "@playwright/test";

import { login, resetApi } from "./support";

test.beforeEach(async ({ page, request }) => {
  await resetApi(request);
  await login(page);
  await page.goto("/usuarios");
});

const rows = (page: Page) => page.getByRole("table").getByRole("row");

async function fillUser(page: Page, data: Partial<Record<string, string>> = {}) {
  await page.getByLabel("Nome Completo").fill(data.name ?? "Paula Cristina Teixeira");
  await page.getByLabel("Matrícula").fill(data.registration ?? "555555");
  await page.getByLabel("E-mail").fill(data.email ?? "paula.teixeira@wenlock.com");
  await page.getByLabel(/^Senha/).fill(data.password ?? "abc123");
  await page.getByLabel(/^Repetir Senha/).fill(data.password ?? "abc123");
}

test("lista com paginação de 10 itens", async ({ page }) => {
  await expect(rows(page)).toHaveCount(11); // cabeçalho + 10
  await expect(page.getByText(/Total de itens:\s*17/)).toBeVisible();

  await page.getByRole("link", { name: "Próxima página" }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(rows(page)).toHaveCount(8); // cabeçalho + 7
});

test("itens por página troca o tamanho da página", async ({ page }) => {
  await page.getByRole("link", { name: "Próxima página" }).click();
  await page.getByLabel("Itens por página").selectOption("50");
  await expect(page).toHaveURL(/limit=50/);
  await expect(page).not.toHaveURL(/page=2/);
  await expect(rows(page)).toHaveCount(18); // cabeçalho + 17
  await expect(page.getByText("de 1", { exact: true })).toBeVisible();
});

test("pesquisa por nome e estado sem resultado", async ({ page }) => {
  await page.getByRole("searchbox", { name: "Pesquisa" }).fill("raimundo");
  await expect(page).toHaveURL(/search=raimundo/);
  await expect(rows(page)).toHaveCount(2);
  await expect(
    page.getByRole("cell", { name: "Raimundo Neto Abreu Teixeira", exact: true }),
  ).toBeVisible();

  await page.getByRole("searchbox", { name: "Pesquisa" }).fill("zzzz");
  await expect(page.getByText("Nenhum Resultado Encontrado")).toBeVisible();

  await page.getByRole("button", { name: "Limpar pesquisa" }).click();
  await expect(rows(page)).toHaveCount(11);
});

test("visualiza os dados no painel lateral", async ({ page }) => {
  await page.getByRole("button", { name: "Visualizar Adriano Machado Souza" }).click();
  const drawer = page.getByRole("dialog", { name: "Visualizar Usuário" });
  await expect(drawer).toHaveAttribute("data-state", "open");
  await expect(drawer).toContainText("200.001");
  await expect(drawer).toContainText("08/05/2024");
  await expect(drawer).toContainText("Nenhuma");
  await drawer.getByRole("button", { name: "Fechar" }).last().click();
  await expect(drawer).toBeHidden();
});

test("cadastra com validação e toast", async ({ page }) => {
  await page.getByRole("link", { name: "Cadastrar Usuário" }).click();
  const submit = page.getByRole("button", { name: "Cadastrar" });
  await expect(submit).toBeDisabled();

  await page.getByLabel("Nome Completo").pressSequentially("Paula 99");
  await expect(page.getByLabel("Nome Completo")).toHaveValue("Paula ");
  await page.getByLabel("Matrícula").pressSequentially("5a5b");
  await expect(page.getByLabel("Matrícula")).toHaveValue("55");
  await expect(page.getByText("Mínimo de 4 números")).toBeVisible();
  await expect(submit).toBeDisabled();

  await fillUser(page);
  await expect(submit).toBeEnabled();
  await submit.click();

  await expect(page.getByText("Cadastro Realizado!")).toBeVisible();
  await expect(page).toHaveURL(/\/usuarios$/);
  await expect(page.getByText(/Total de itens:\s*18/)).toBeVisible();
});

test("matrícula duplicada é apontada no campo", async ({ page }) => {
  await page.goto("/usuarios/cadastro");
  await fillUser(page, { registration: "100001" });
  await page.getByRole("button", { name: "Cadastrar" }).click();

  await expect(page.getByLabel("Matrícula")).toHaveAttribute("aria-invalid", "true");
  await expect(
    page.getByRole("alert").filter({ hasText: "Já existe um usuário com esta matrícula" }),
  ).toBeVisible();
});

test("cancelar com dados pede confirmação", async ({ page }) => {
  await page.goto("/usuarios/cadastro");
  await page.getByLabel("Nome Completo").fill("Alguém");
  await page.getByRole("button", { name: "Cancelar" }).click();

  const dialog = page.getByRole("dialog", { name: "Deseja cancelar?" });
  await expect(dialog).toContainText("Os dados inseridos não serão salvos");
  await dialog.getByRole("button", { name: "Não" }).click();
  await expect(page.getByLabel("Nome Completo")).toHaveValue("Alguém");

  await page.getByRole("button", { name: "Cancelar" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Sim" }).click();
  await expect(page).toHaveURL(/\/usuarios$/);
  await expect(page.getByText("Cadastro cancelado")).toBeVisible();
});

test("edita: Salvar só habilita após alteração", async ({ page }) => {
  await page.getByRole("link", { name: "Editar Adriano Machado Souza" }).click();
  await expect(page.getByRole("heading", { name: "Editar Usuário" })).toBeVisible();
  const save = page.getByRole("button", { name: "Salvar" });
  await expect(save).toBeDisabled();

  await page.getByLabel("Nome Completo").fill("Adriano Souza");
  await expect(save).toBeEnabled();
  await save.click();

  await expect(page.getByText("Dados salvos com sucesso!")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Adriano Souza", exact: true })).toBeVisible();
});

test("exclui após confirmar", async ({ page }) => {
  await page.getByRole("button", { name: "Excluir Adriano Machado Souza" }).click();
  const dialog = page.getByRole("dialog", { name: "Deseja excluir?" });
  await expect(dialog).toContainText("O usuário será excluído.");
  await dialog.getByRole("button", { name: "Sim" }).click();

  await expect(page.getByText("Exclusão Realizada!")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Adriano Machado Souza", exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByText(/Total de itens:\s*16/)).toBeVisible();
});
