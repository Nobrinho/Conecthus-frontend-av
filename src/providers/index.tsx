"use client";

import { QueryProvider } from "./query-provider";

/** Ponto único para compor os providers globais (tema, auth, i18n...). */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
