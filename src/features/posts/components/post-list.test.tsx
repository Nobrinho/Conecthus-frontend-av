import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/utils";

import { postsApi } from "../api/posts.api";

import { PostList } from "./post-list";

describe("PostList", () => {
  it("renders posts returned by the API", async () => {
    vi.spyOn(postsApi, "list").mockResolvedValue([
      { id: 1, userId: 1, title: "Primeiro post", body: "Conteúdo" },
    ]);

    renderWithProviders(<PostList />);

    expect(await screen.findByText("Primeiro post")).toBeInTheDocument();
  });

  it("shows an error state when the request fails", async () => {
    vi.spyOn(postsApi, "list").mockRejectedValue(new Error("boom"));

    renderWithProviders(<PostList />);

    expect(await screen.findByText(/não foi possível carregar/i)).toBeInTheDocument();
  });
});
