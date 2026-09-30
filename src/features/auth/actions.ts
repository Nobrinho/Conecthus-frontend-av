"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { routes } from "@/config/routes";
import { type ActionResult, fail, ok } from "@/lib/action-result";
import { ApiError } from "@/lib/api";
import { clearSession, getRefreshToken, saveSession } from "@/lib/session";

import { authApi } from "./api/auth.api";
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
  type LoginInput,
  loginSchema,
  type ResetPasswordInput,
  resetPasswordSchema,
} from "./types";

const GENERIC_ERROR = "Não foi possível concluir. Tente novamente.";
const INVALID_CREDENTIALS = "Usuário/Senha inválido(a)";

export async function loginAction(input: LoginInput): Promise<ActionResult<{ name: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Dados inválidos.", z.flattenError(parsed.error).fieldErrors);
  }

  try {
    const { user, tokens } = await authApi.login(parsed.data);
    await saveSession(tokens);
    return ok({ name: user.name });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Os dois campos ficam em vermelho, como na tela de login inválido do XD.
      return fail(INVALID_CREDENTIALS, {
        login: [INVALID_CREDENTIALS],
        password: [INVALID_CREDENTIALS],
      });
    }
    if (error instanceof ApiError && error.status === 429) {
      return fail("Muitas tentativas. Aguarde um minuto e tente de novo.");
    }
    console.error(error);
    return fail(GENERIC_ERROR);
  }
}

export async function logoutAction(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    // Encerra a sessão também na API; se falhar, os cookies saem mesmo assim.
    await authApi.logout(refreshToken).catch(() => undefined);
  }
  await clearSession();
  redirect(routes.login);
}

export async function forgotPasswordAction(input: ForgotPasswordInput): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Dados inválidos.", z.flattenError(parsed.error).fieldErrors);
  }

  try {
    await authApi.forgotPassword(parsed.data);
    return ok(undefined);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404)
      return fail("E-mail não cadastrado. Contate o admin");
    if (error instanceof ApiError && error.status === 429) {
      return fail("Muitas tentativas. Aguarde um minuto e tente de novo.");
    }
    console.error(error);
    return fail(GENERIC_ERROR);
  }
}

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Dados inválidos.", z.flattenError(parsed.error).fieldErrors);
  }

  try {
    await authApi.resetPassword({ token: parsed.data.token, password: parsed.data.password });
    return ok(undefined);
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      return fail(error.userMessage ?? "Link de recuperação inválido ou expirado");
    }
    console.error(error);
    return fail(GENERIC_ERROR);
  }
}
