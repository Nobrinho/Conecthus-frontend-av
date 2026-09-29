"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { serverEnv } from "@/config/env.server";
import { routes } from "@/config/routes";

import { postsApi } from "./api/posts.api";
import { type CreatePostInput, createPostSchema, type Post } from "./types";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

/**
 * Server Action: roda só no servidor, então pode usar segredos (`serverEnv`).
 * Retorna um resultado em vez de lançar erro, porque em produção o Next.js
 * esconde a mensagem de erros lançados em Server Actions.
 */
export async function createPostAction(input: CreatePostInput): Promise<ActionResult<Post>> {
  const parsed = createPostSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Dados inválidos.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const post = await postsApi.create(
      { ...parsed.data, userId: 1 },
      serverEnv.API_TOKEN ? { headers: { Authorization: `Bearer ${serverEnv.API_TOKEN}` } } : {},
    );
    revalidatePath(routes.posts);
    return { ok: true, data: post };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Não foi possível criar o post." };
  }
}
