"use client";

import { ToastProvider } from "@/components/ui";

/** Ponto único para compor os providers globais. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
