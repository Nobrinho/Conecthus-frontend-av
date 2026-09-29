import { expect, test } from "@playwright/test";

test.describe("navegação", () => {
  test("home renderiza e leva até a lista de posts", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Frontend Next.js Template");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Frontend Next.js Template");

    await page.getByRole("link", { name: "Ver exemplo de feature" }).click();

    await expect(page).toHaveURL("/posts");
    await expect(page.getByRole("heading", { name: "Posts", level: 1 })).toBeVisible();
  });

  test("header navega entre as páginas", async ({ page }) => {
    await page.goto("/posts");

    await page.getByRole("navigation").getByRole("link", { name: "Início" }).click();

    await expect(page).toHaveURL("/");
  });

  test("rota inexistente mostra a página 404", async ({ page }) => {
    const response = await page.goto("/rota-que-nao-existe");

    expect(response?.status()).toBe(404);
    await expect(page.getByText("Página não encontrada.")).toBeVisible();
  });
});
