import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ApiError } from "./errors";
import { http, request } from "./http-client";

const schema = z.object({ id: z.number() });
const BASE = "https://api.example.com/v1";

function mockFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const json = (data: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" }, ...init });

afterEach(() => vi.unstubAllGlobals());

describe("request", () => {
  it("builds the URL from base path, path and query, skipping undefined values", async () => {
    const fetchMock = mockFetch(json({ id: 1 }));

    await request("/posts", {
      schema,
      baseUrl: BASE,
      query: { _limit: 5, q: undefined, active: true },
    });

    const url = fetchMock.mock.calls[0][0] as URL;
    expect(url.toString()).toBe(`${BASE}/posts?_limit=5&active=true`);
  });

  it("returns data validated by the schema", async () => {
    mockFetch(json({ id: 1, extra: "ignored" }));

    await expect(request("/x", { schema, baseUrl: BASE })).resolves.toEqual({ id: 1 });
  });

  it("serializes the body and sets Content-Type on POST", async () => {
    const fetchMock = mockFetch(json({ id: 2 }, { status: 201 }));

    await http.post("/posts", { schema, baseUrl: BASE, body: { title: "a" } });

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ title: "a" }));
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
  });

  it("throws ApiError with status and body on non-2xx responses", async () => {
    mockFetch(json({ message: "not found" }, { status: 404, statusText: "Not Found" }));

    const error = await request("/x", { schema, baseUrl: BASE }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, body: { message: "not found" } });
  });

  it("rejects when the response does not match the schema", async () => {
    mockFetch(json({ id: "not-a-number" }));

    await expect(request("/x", { schema, baseUrl: BASE })).rejects.toBeInstanceOf(z.ZodError);
  });

  it("handles 204 No Content", async () => {
    mockFetch(new Response(null, { status: 204 }));

    await expect(request("/x", { schema: z.null(), baseUrl: BASE })).resolves.toBeNull();
  });
});
