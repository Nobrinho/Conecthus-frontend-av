import "server-only";

import type { z } from "zod";

import { serverEnv } from "@/config/env.server";

import { ApiError } from "./errors";

type Query = Record<string, string | number | boolean | undefined>;

export interface RequestOptions<TSchema extends z.ZodType> extends Omit<RequestInit, "body"> {
  /** Schema zod usado para validar a resposta em runtime. */
  schema: TSchema;
  query?: Query;
  body?: unknown;
  baseUrl?: string;
}

function buildUrl(path: string, baseUrl: string, query?: Query) {
  const url = new URL(path.replace(/^\//, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url;
}

/**
 * Cliente HTTP único da aplicação. Roda só no servidor (Server Components,
 * Server Actions e Route Handlers), valida a resposta com zod e padroniza
 * erros em `ApiError`.
 */
export async function request<TSchema extends z.ZodType>(
  path: string,
  { schema, query, body, baseUrl = serverEnv.API_URL, headers, ...init }: RequestOptions<TSchema>,
): Promise<z.infer<TSchema>> {
  const response = await fetch(buildUrl(path, baseUrl, query), {
    // Dados de usuário são sempre dinâmicos e por sessão: nada de cache.
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data: unknown = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
      data,
    );
  }

  return schema.parse(data);
}

export const http = {
  get: <T extends z.ZodType>(path: string, opts: Omit<RequestOptions<T>, "method" | "body">) =>
    request(path, { ...opts, method: "GET" }),
  post: <T extends z.ZodType>(path: string, opts: Omit<RequestOptions<T>, "method">) =>
    request(path, { ...opts, method: "POST" }),
  put: <T extends z.ZodType>(path: string, opts: Omit<RequestOptions<T>, "method">) =>
    request(path, { ...opts, method: "PUT" }),
  patch: <T extends z.ZodType>(path: string, opts: Omit<RequestOptions<T>, "method">) =>
    request(path, { ...opts, method: "PATCH" }),
  delete: <T extends z.ZodType>(path: string, opts: Omit<RequestOptions<T>, "method" | "body">) =>
    request(path, { ...opts, method: "DELETE" }),
};
