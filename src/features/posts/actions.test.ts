import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { createPostAction } from "./actions";
import { postsApi } from "./api/posts.api";

describe("createPostAction", () => {
  it("returns field errors for invalid input without calling the API", async () => {
    const create = vi.spyOn(postsApi, "create");

    const result = await createPostAction({ title: "a", body: "" });

    expect(result.ok).toBe(false);
    expect(!result.ok && result.fieldErrors?.title).toBeDefined();
    expect(create).not.toHaveBeenCalled();
  });

  it("creates the post and returns it", async () => {
    const post = { id: 101, userId: 1, title: "Título", body: "Conteúdo do post" };
    vi.spyOn(postsApi, "create").mockResolvedValue(post);

    await expect(createPostAction({ title: "Título", body: "Conteúdo do post" })).resolves.toEqual({
      ok: true,
      data: post,
    });
  });

  it("returns a generic error when the API fails", async () => {
    vi.spyOn(postsApi, "create").mockRejectedValue(new Error("boom"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await createPostAction({ title: "Título", body: "Conteúdo do post" });

    expect(result).toEqual({ ok: false, error: "Não foi possível criar o post." });
  });
});
