import { expect, test } from "@playwright/test";

test.describe("posts", () => {
  test("lista os posts buscados no cliente, respeitando o limite", async ({ page }) => {
    await page.goto("/posts");

    const cards = page.getByRole("article");
    await expect(cards).toHaveCount(10);
    await expect(cards.first()).toContainText("Primeiro post de exemplo");
  });

  test("abre o detalhe de um post renderizado no servidor", async ({ page }) => {
    await page.goto("/posts");

    await page.getByRole("link", { name: /Primeiro post de exemplo/ }).click();

    await expect(page).toHaveURL("/posts/1");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Primeiro post de exemplo");
    await expect(page).toHaveTitle("Primeiro post de exemplo | Frontend Next.js Template");

    await page.getByRole("link", { name: "← Voltar" }).click();
    await expect(page).toHaveURL("/posts");
  });

  test("post inexistente mostra a página 404", async ({ page }) => {
    await page.goto("/posts/999");

    await expect(page.getByText("Página não encontrada.")).toBeVisible();
  });

  test("mostra estado de erro e permite tentar novamente quando a API falha", async ({ page }) => {
    let fail = true;
    // Intercepta a chamada feita pelo navegador (React Query) — não afeta o servidor Next.js.
    await page.route("**/posts?_limit=10", (route) =>
      fail ? route.fulfill({ status: 500, body: "{}" }) : route.fallback(),
    );

    await page.goto("/posts");
    await expect(page.getByText("Não foi possível carregar os posts.")).toBeVisible();

    fail = false;
    await page.getByRole("button", { name: "Tentar novamente" }).click();

    await expect(page.getByRole("article")).toHaveCount(10);
  });
});
