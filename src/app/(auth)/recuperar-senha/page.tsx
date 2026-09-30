import type { Metadata } from "next";

import { LockResetIllustration } from "@/components/brand/illustrations";
import { Logo } from "@/components/brand/logo";
import { AuthShell, ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Recuperação de senha" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      aside={<LockResetIllustration className="w-[22rem] xl:w-[28.8125rem]" />}
      className="md:px-[2.5625rem] md:pt-[3.125rem] xl:max-w-[45rem]"
    >
      <Logo className="text-logo-ink mb-16 hidden h-9 lg:block" />
      <ForgotPasswordForm />
    </AuthShell>
  );
}
