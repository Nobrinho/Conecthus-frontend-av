import { describe, expect, it } from "vitest";

import { isTokenFresh, readJwtExpiry, readJwtSubject } from "./tokens";

const jwt = (payload: object) =>
  `h.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.s`;

describe("tokens de sessão", () => {
  it("lê o exp do JWT", () => {
    expect(readJwtExpiry(jwt({ exp: 123 }))).toBe(123);
    expect(readJwtExpiry("lixo")).toBeNull();
  });

  it("lê o sub (id do usuário) do JWT", () => {
    expect(readJwtSubject(jwt({ sub: "abc-123" }))).toBe("abc-123");
    expect(readJwtSubject(jwt({ sub: 42 }))).toBeNull();
    expect(readJwtSubject("lixo")).toBeNull();
  });

  it("considera vencido o token perto de expirar", () => {
    const now = Date.now();
    const inSeconds = (s: number) => jwt({ exp: Math.floor(now / 1000) + s });

    expect(isTokenFresh(inSeconds(600), now)).toBe(true);
    expect(isTokenFresh(inSeconds(10), now)).toBe(false);
    expect(isTokenFresh(undefined, now)).toBe(false);
  });
});
