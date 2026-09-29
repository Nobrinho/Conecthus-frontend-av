"use client";

import { useQuery } from "@tanstack/react-query";

import { postsApi } from "../api/posts.api";
import { postKeys } from "../api/query-keys";

export function usePosts(params: { limit?: number } = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postsApi.list(params),
  });
}
