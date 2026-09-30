/**
 * Nomes e regras dos cookies de sessão. Sem `server-only` porque também é
 * usado pelo `proxy.ts`, que roda antes do render.
 */
export const ACCESS_COOKIE = "wl_access";
export const REFRESH_COOKIE = "wl_refresh";

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
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: unknown;
    };
    return typeof json.exp === "number" ? json.exp : null;
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
