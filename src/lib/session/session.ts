import "server-only";

import { cookies } from "next/headers";

import { ACCESS_COOKIE, cookieOptionsFor, REFRESH_COOKIE, type SessionTokens } from "./tokens";

/** Access token da requisição atual. O `proxy.ts` garante que ele esteja válido. */
export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

/** Grava a sessão. Só pode ser chamado em Server Actions e Route Handlers. */
export async function saveSession(tokens: SessionTokens): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, tokens.accessToken, cookieOptionsFor(tokens.accessToken));
  store.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptionsFor(tokens.refreshToken));
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
