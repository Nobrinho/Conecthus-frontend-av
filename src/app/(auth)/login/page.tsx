import type { Metadata } from "next";

import { AuthShell, LoginForm, Splash } from "@/features/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    <>
      <Splash />
      <AuthShell>
        <LoginForm next={typeof next === "string" ? next : null} />
      </AuthShell>
    </>
  );
}
