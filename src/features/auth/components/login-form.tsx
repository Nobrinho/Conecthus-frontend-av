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
      <h1 className="text-brand text-4xl font-bold md:text-5xl">Bem-vindo!</h1>
      <p className="mt-6 text-lg font-medium">Entre com sua conta</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-2">
        <TextField
          label="Usuário"
          autoComplete="username"
          hint="E-mail ou matrícula"
          error={errors.login?.message}
          {...register("login")}
        />
        <TextField
          label="Senha"
          type="password"
          revealable
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending || entering}>
          {pending ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link href={routes.forgotPassword} className="text-brand text-sm font-bold hover:underline">
          Esqueci minha senha
        </Link>
      </p>
    </>
  );
}
