"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

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
      <h1 className="text-brand text-2xl font-bold">Recuperação de senha</h1>
      <p className="mt-2 text-sm">Insira seu e-mail para recuperar sua senha.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-2">
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Enviando..." : "Recuperar"}
        </Button>
      </form>

      <p className="mt-8 text-center">
        <Link
          href={routes.login}
          className="text-fg-muted hover:text-fg inline-flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeftCircle aria-hidden className="size-5" />
          Voltar para o login
        </Link>
      </p>

      <Dialog
        open={sent}
        onClose={() => router.push(routes.login)}
        labelledBy={titleId}
        describedBy={descriptionId}
        className="max-w-xs"
      >
        <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
          <h2 id={titleId} className="text-xl font-bold">
            E-mail enviado!
          </h2>
          <CheckCircle2 aria-hidden className="text-brand size-14" strokeWidth={1.5} />
          <p id={descriptionId} className="text-sm">
            Lhe enviamos um e-mail com um link para recuperação da sua senha.
          </p>
          <Button className="min-w-36" onClick={() => router.push(routes.login)} autoFocus>
            Continuar
          </Button>
        </div>
      </Dialog>
    </>
  );
}
