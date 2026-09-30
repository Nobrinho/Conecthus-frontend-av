import type { Metadata } from "next";
import Link from "next/link";

import { LockResetIllustration } from "@/components/brand/illustrations";
import { Logo } from "@/components/brand/logo";
import { routes } from "@/config/routes";
import { AuthShell, ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Nova senha" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/redefinir-senha">) {
  const { token } = await searchParams;

  return (
    <AuthShell
      aside={<LockResetIllustration className="w-[22rem] xl:w-[28.8125rem]" />}
      className="md:px-[2.5625rem] md:pt-[3.125rem] xl:max-w-[45rem]"
    >
      <Logo className="text-logo-ink mb-16 hidden h-9 lg:block" />
      {typeof token === "string" && token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-brand text-2xl font-bold">Link inválido</h1>
          <p className="text-sm">
            Este link de recuperação está incompleto. Peça um novo na tela de recuperação de senha.
          </p>
          <Link
            href={routes.forgotPassword}
            className="text-brand text-sm font-bold hover:underline"
          >
            Recuperar senha
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
