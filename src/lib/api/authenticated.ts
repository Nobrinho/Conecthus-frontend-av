import "server-only";

import { redirect } from "next/navigation";
import type { z } from "zod";

import { routes } from "@/config/routes";
import { getAccessToken } from "@/lib/session";
import { SESSION_LOST_PARAM } from "@/lib/session/tokens";

import { ApiError } from "./errors";
import { request, type RequestOptions } from "./http-client";

/**
 * Chamada à API em nome do usuário logado: injeta o access token do cookie.
 * Um 401 aqui significa sessão perdida (revogada ou expirada de vez), então a
 * pessoa volta para o login.
 */
export async function authRequest<TSchema extends z.ZodType>(
  path: string,
  options: RequestOptions<TSchema>,
): Promise<z.infer<TSchema>> {
  const token = await getAccessToken();
  if (!token) redirect(routes.login);

  try {
    return await request(path, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect(`${routes.login}?${SESSION_LOST_PARAM}=1`);
    }
    throw error;
  }
}

type Opts<T extends z.ZodType> = Omit<RequestOptions<T>, "method">;

export const authHttp = {
  get: <T extends z.ZodType>(path: string, opts: Omit<Opts<T>, "body">) =>
    authRequest(path, { ...opts, method: "GET" }),
  post: <T extends z.ZodType>(path: string, opts: Opts<T>) =>
    authRequest(path, { ...opts, method: "POST" }),
  patch: <T extends z.ZodType>(path: string, opts: Opts<T>) =>
    authRequest(path, { ...opts, method: "PATCH" }),
  delete: <T extends z.ZodType>(path: string, opts: Omit<Opts<T>, "body">) =>
    authRequest(path, { ...opts, method: "DELETE" }),
};
