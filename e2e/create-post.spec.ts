import { expect, test } from "@playwright/test";

test.describe("criar post (Server Action)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/posts");
  });

  test("mostra os erros de validação vindos do servidor", async ({ page }) => {
    await page.getByLabel("Título").fill("ab");
    await page.getByRole("button", { name: "Criar post" }).click();

    await expect(page.getByText("O título precisa ter pelo menos 3 caracteres.")).toBeVisible();
    await expect(page.getByText("O conteúdo precisa ter pelo menos 10 caracteres.")).toBeVisible();
    await expect(page.getByLabel("Título")).toHaveAttribute("aria-invalid", "true");
  });

  test("cria o post e limpa o formulário", async ({ page }) => {
    await page.getByLabel("Título").fill("Meu post via E2E");
    await page.getByLabel("Conteúdo").fill("Conteúdo escrito pelo Playwright.");
    await page.getByRole("button", { name: "Criar post" }).click();

    await expect(page.getByRole("status").filter({ hasText: "Post #101 criado." })).toBeVisible();
    await expect(page.getByLabel("Título")).toHaveValue("");
    await expect(page.getByLabel("Conteúdo")).toHaveValue("");
  });
});
