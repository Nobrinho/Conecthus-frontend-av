"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPostAction } from "../actions";
import { postKeys } from "../api/query-keys";

/** Mutation via Server Action + invalidação do cache do React Query. */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostAction,
    onSuccess: (result) => {
      if (result.ok) queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
