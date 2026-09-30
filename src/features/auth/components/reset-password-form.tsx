"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { BackCircleIcon } from "@/components/icons";
import { Button, TextField, useToast } from "@/components/ui";
import { routes } from "@/config/routes";

import { resetPasswordAction } from "../actions";
import { type ResetPasswordInput, resetPasswordSchema } from "../types";

/** Destino do link enviado por e-mail. Não há tela no protótipo; segue o visual da recuperação. */
export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Senha redefinida! Entre com a nova senha.");
      router.replace(routes.login);
    }),
  );

  return (
    <>
      <h1 className="text-brand text-heading font-bold">Nova senha</h1>
      <p className="mt-2 text-lg font-medium">
        Crie uma senha com 6 caracteres, apenas letras e números.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-[1.9375rem]">
        <input type="hidden" {...register("token")} />
        <TextField
          label="Senha"
          type="password"
          appearance="outlined"
          revealable
          maxLength={6}
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password", { deps: ["confirmPassword"] })}
        />
        <TextField
          label="Repetir Senha"
          type="password"
          appearance="outlined"
          revealable
          maxLength={6}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          type="submit"
          variant="cta"
          size="lg"
          className="w-full"
          disabled={!isValid || pending}
        >
          {pending ? "Salvando..." : "Redefinir senha"}
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
    </>
  );
}
