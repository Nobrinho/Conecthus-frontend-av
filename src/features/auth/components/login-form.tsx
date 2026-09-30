"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button, TextField, useToast } from "@/components/ui";
import { routes } from "@/config/routes";

import { loginAction } from "../actions";
import { type LoginInput, loginSchema } from "../types";
import { LoginTransition } from "./login-transition";

/** Tempo da animação de carregamento antes de entrar, como no protótipo. */
const TRANSITION_MS = 1400;

/** Só aceita destinos internos, para o `?next=` não virar um open redirect. */
function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : routes.home;
}

export function LoginForm({ next }: { next: string | null }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [entering, setEntering] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { login: "", password: "" },
  });

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await loginAction(values);
      if (!result.ok) {
        toast.error(result.error);
        // Credenciais recusadas: marca os campos (a mensagem já está no toast).
        for (const field of ["login", "password"] as const) {
          if (result.fieldErrors?.[field]) setError(field, { type: "server", message: "" });
        }
        return;
      }
      const destination = safeNext(next);
      router.prefetch(destination);
      setEntering(true);
      toast.success("Usuário logado com sucesso!");
      setTimeout(() => {
        router.replace(destination);
        router.refresh();
      }, TRANSITION_MS);
    }),
  );

  return (
    <>
      {entering && <LoginTransition />}
      <h1 className="text-brand md:text-display text-5xl font-bold">Bem-vindo!</h1>
      <p className="text-heading mt-6 font-medium md:mt-[1.875rem]">Entre com sua conta</p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-8 flex flex-col gap-[2.125rem] md:mt-[2.1875rem]"
      >
        <TextField
          label="Usuário"
          placeholderLabel="E-mail ou N° matrícula"
          appearance="outlined"
          autoComplete="username"
          error={errors.login?.message || undefined}
          invalid={Boolean(errors.login)}
          {...register("login")}
        />
        <TextField
          label="Senha"
          type="password"
          appearance="outlined"
          revealable
          autoComplete="current-password"
          error={errors.password?.message || undefined}
          invalid={Boolean(errors.password)}
          {...register("password")}
        />
        <Button
          type="submit"
          variant="cta"
          size="lg"
          className="w-full"
          disabled={pending || entering}
        >
          {pending ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-[1.875rem] text-center">
        <Link
          href={routes.forgotPassword}
          className="text-brand hover:text-brand-hover text-lg font-bold transition-colors"
        >
          Esqueci minha senha
        </Link>
      </p>
    </>
  );
}
