import { http } from "@/lib/api";

import { type CreatePostInput, postListSchema, postSchema } from "../types";

export const postsApi = {
  list: (params: { limit?: number } = {}) =>
    http.get("/posts", { schema: postListSchema, query: { _limit: params.limit } }),

  getById: (id: number) => http.get(`/posts/${id}`, { schema: postSchema }),

  create: (input: CreatePostInput & { userId: number }, init?: { headers?: HeadersInit }) =>
    http.post("/posts", { schema: postSchema, body: input, ...init }),
};
