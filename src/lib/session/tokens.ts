/**
 * Nomes e regras dos cookies de sessão. Sem `server-only` porque também é
 * usado pelo `proxy.ts`, que roda antes do render.
 */
export const ACCESS_COOKIE = "wl_access";
export const REFRESH_COOKIE = "wl_refresh";
/** Query do login que marca sessão recusada pela API (o proxy limpa os cookies). */
export const SESSION_LOST_PARAM = "expired";

/** Margem para renovar o access token um pouco antes de ele vencer. */
const EXPIRY_SKEW_SECONDS = 30;

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CookieOptions {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  expires: Date;
}

/**
 * Lê o `exp` de um JWT sem verificar a assinatura. Serve apenas para decidir
 * se vale renovar a sessão (checagem otimista); quem valida o token de verdade
 * é a API a cada requisição.
 */
export function readJwtExpiry(token: string): number | null {
  const exp = readJwtPayload(token)?.exp;
  return typeof exp === "number" ? exp : null;
}

/**
 * Lê o `sub` (id do usuário) de um JWT, também sem verificar a assinatura.
 * Serve para recusar cedo pedidos óbvios (ex.: excluir a própria conta); a
 * API continua aplicando a mesma regra com o token validado.
 */
export function readJwtSubject(token: string): string | null {
  const sub = readJwtPayload(token)?.sub;
  return typeof sub === "string" ? sub : null;
}

function readJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json: unknown = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json && typeof json === "object" ? (json as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function isTokenFresh(token: string | undefined, now = Date.now()): token is string {
  if (!token) return false;
  const exp = readJwtExpiry(token);
  return exp !== null && exp - EXPIRY_SKEW_SECONDS > now / 1000;
}

/** Opções do cookie: httpOnly, `sameSite=lax` e expiração igual à do JWT. */
export function cookieOptionsFor(token: string): CookieOptions {
  const exp = readJwtExpiry(token);
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date((exp ?? Date.now() / 1000 + 60 * 60) * 1000),
  };
}
