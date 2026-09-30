"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { BackCircleIcon, CheckCircleIcon } from "@/components/icons";
import { Button, Dialog, TextField, useToast } from "@/components/ui";
import { routes } from "@/config/routes";

import { forgotPasswordAction } from "../actions";
import { type ForgotPasswordInput, forgotPasswordSchema } from "../types";

export function ForgotPasswordForm() {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await forgotPasswordAction(values);
      if (result.ok) setSent(true);
      else toast.error(result.error);
    }),
  );

  return (
    <>
      <h1 className="text-brand text-heading font-bold">Recuperação de senha</h1>
      <p className="mt-2 text-lg font-medium">Insira seu e-mail para recuperar sua senha.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-[1.9375rem]">
        <TextField
          label="E-mail"
          type="email"
          appearance="outlined"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" variant="cta" size="lg" className="w-full" disabled={pending}>
          {pending ? "Enviando..." : "Recuperar"}
        </Button>
      </form>

      <p className="mt-[3.25rem] text-center">
        <Link
          href={routes.login}
          className="text-fg-muted hover:text-brand-hover inline-flex items-center gap-2 text-lg font-bold transition-colors"
        >
          <BackCircleIcon className="size-6" />
          Voltar para o login
        </Link>
      </p>

      <Dialog
        open={sent}
        onClose={() => router.push(routes.login)}
        labelledBy={titleId}
        describedBy={descriptionId}
        className="max-w-[28.875rem]"
      >
        <div className="flex min-h-[21.125rem] flex-col items-center justify-center gap-6 px-6 py-7 text-center">
          <h2 id={titleId} className="text-heading font-bold">
            E-mail enviado!
          </h2>
          <CheckCircleIcon className="text-brand size-[5.4375rem]" />
          <p id={descriptionId} className="text-lg font-medium">
            Lhe enviamos um e-mail com um link para recuperação da sua senha.
          </p>
          <Button className="min-w-[10.875rem]" onClick={() => router.push(routes.login)} autoFocus>
            Continuar
          </Button>
        </div>
      </Dialog>
    </>
  );
}
