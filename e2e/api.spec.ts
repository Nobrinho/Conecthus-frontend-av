import { expect, test } from "@playwright/test";

test.describe("infra", () => {
  test("GET /api/health responde ok", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.ok()).toBe(true);
    expect(await response.json()).toMatchObject({ status: "ok" });
  });

  test("proxy aplica os headers de segurança", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});
