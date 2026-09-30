import { type NextRequest, NextResponse } from "next/server";

import { publicRoutes, routes } from "@/config/routes";
import {
  ACCESS_COOKIE,
  cookieOptionsFor,
  isTokenFresh,
  REFRESH_COOKIE,
  SESSION_LOST_PARAM,
  type SessionTokens,
} from "@/lib/session/tokens";

const API_URL = process.env.API_URL ?? "http://localhost:3000/api/v1";

/**
 * Roda antes de cada request (antigo `middleware` no Next.js < 16).
 *
 * 1. Aplica headers de segurança.
 * 2. Checagem otimista de sessão: sem refresh token, as rotas privadas levam
 *    ao login; com sessão, as rotas públicas levam à home.
 * 3. Renova o access token vencido usando o refresh token e reescreve os
 *    cookies na resposta e na própria requisição, para que o Server Component
 *    que vai renderizar já enxergue o token novo. Server Components não podem
 *    gravar cookies, por isso a renovação mora aqui.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  // A API recusou o token (ex.: o usuário logado foi excluído): as páginas
  // redirecionam ao login com este marcador. Sem tratá-lo aqui, o token ainda
  // "fresco" no cookie levaria o login de volta à home, num loop de redirects.
  if (isPublic && request.nextUrl.searchParams.get(SESSION_LOST_PARAM) === "1") {
    const response = NextResponse.next();
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  let tokens: SessionTokens | null = null;
  let loggedIn = isTokenFresh(access);

  if (!loggedIn && refresh) {
    tokens = await refreshSession(refresh);
    loggedIn = tokens !== null;
  }

  let response: NextResponse;

  if (!loggedIn && !isPublic) {
    const loginUrl = new URL(routes.login, request.url);
    if (pathname !== routes.home) loginUrl.searchParams.set("next", `${pathname}${search}`);
    response = NextResponse.redirect(loginUrl);
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
  } else if (loggedIn && isPublic) {
    response = NextResponse.redirect(new URL(routes.home, request.url));
  } else if (tokens) {
    request.cookies.set(ACCESS_COOKIE, tokens.accessToken);
    request.cookies.set(REFRESH_COOKIE, tokens.refreshToken);
    response = NextResponse.next({ request });
  } else {
    response = NextResponse.next();
  }

  if (tokens) {
    response.cookies.set(ACCESS_COOKIE, tokens.accessToken, cookieOptionsFor(tokens.accessToken));
    response.cookies.set(
      REFRESH_COOKIE,
      tokens.refreshToken,
      cookieOptionsFor(tokens.refreshToken),
    );
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

async function refreshSession(refreshToken: string): Promise<SessionTokens | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { tokens?: Partial<SessionTokens> };
    const { accessToken, refreshToken: nextRefresh } = body.tokens ?? {};
    return accessToken && nextRefresh ? { accessToken, refreshToken: nextRefresh } : null;
  } catch {
    return null;
  }
}

export const config = {
  // Ignora assets, a sonda de saúde e os arquivos de metadados.
  matcher: [
    "/((?!_next/static|_next/image|api/health|favicon.ico|icon|.*\\.(?:svg|png|woff2)$).*)",
  ],
};
