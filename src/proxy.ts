import { NextResponse } from "next/server";

/**
 * Roda antes de cada request (antigo `middleware` no Next.js < 16).
 * Use para headers, redirects e checagens otimistas de auth — não para buscar dados.
 */
export function proxy() {
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
