import { expect, type Page, type APIRequestContext } from "@playwright/test";

export const MOCK_API = "http://127.0.0.1:4010/api/v1";
export const DEMO = {
  email: "millena.souza@wenlock.com",
  registration: "100001",
  password: "abc123",
};

/** Restaura os dados iniciais da API fake. */
export async function resetApi(request: APIRequestContext) {
  await request.post(`${MOCK_API}/__reset`);
}

/** Faz login pela tela e espera a Home. */
export async function login(page: Page, loginValue: string = DEMO.email) {
  await page.goto("/login");
  await page.getByLabel("Usuário").fill(loginValue);
  await page.getByLabel("Senha", { exact: true }).fill(DEMO.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible({ timeout: 10_000 });
}
