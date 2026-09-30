import type { Metadata } from "next";

import { LockResetIllustration } from "@/components/brand/illustrations";
import { Logo } from "@/components/brand/logo";
import { AuthShell, ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Recuperação de senha" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell aside={<LockResetIllustration className="w-[20rem] xl:w-[24rem]" />}>
      <Logo className="text-fg mb-10 hidden text-4xl md:inline-flex" />
      <ForgotPasswordForm />
    </AuthShell>
  );
}
