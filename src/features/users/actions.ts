"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { routes } from "@/config/routes";
import { type ActionResult, fail, ok } from "@/lib/action-result";
import { ApiError } from "@/lib/api";

import { usersApi } from "./api/users.api";
import { createUserSchema, updateUserSchema, type User, type UserFormValues } from "./types";

/**
 * Converte o erro da API em mensagem para o formulário. O 409 traz em `field`
 * qual dado já existe, e o erro é associado a esse campo.
 */
function toFailure(error: unknown, fallback: string): ActionResult<never> {
  if (error instanceof ApiError) {
    const details = error.details;
    if (error.status === 409 && details?.field) {
      const message = error.userMessage ?? "Valor já cadastrado";
      return fail(message, { [details.field]: [message] });
    }
    if (error.status === 404) return fail("Usuário não encontrado.");
    if (error.status === 400 && error.userMessage) return fail(error.userMessage);
  }
  console.error(error);
  return fail(fallback);
}

export async function createUserAction(input: UserFormValues): Promise<ActionResult<User>> {
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Verifique os campos destacados.", z.flattenError(parsed.error).fieldErrors);
  }

  const { name, email, registration, password } = parsed.data;
  try {
    const user = await usersApi.create({ name, email, registration, password });
    revalidatePath(routes.users);
    return ok(user);
  } catch (error) {
    return toFailure(error, "Não foi possível cadastrar o usuário.");
  }
}

export async function updateUserAction(
  id: string,
  input: UserFormValues,
): Promise<ActionResult<User>> {
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Verifique os campos destacados.", z.flattenError(parsed.error).fieldErrors);
  }

  const { name, email, registration, password } = parsed.data;
  try {
    // Senha em branco na edição significa "manter a atual": não é enviada.
    const user = await usersApi.update(id, {
      name,
      email,
      registration,
      ...(password ? { password } : {}),
    });
    revalidatePath(routes.users);
    return ok(user);
  } catch (error) {
    return toFailure(error, "Não foi possível salvar as alterações.");
  }
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  try {
    await usersApi.remove(id);
    revalidatePath(routes.users);
    return ok(undefined);
  } catch (error) {
    return toFailure(error, "Não foi possível excluir o usuário.");
  }
}
