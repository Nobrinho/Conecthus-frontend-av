import { z } from "zod";

import { USER_RULES } from "./rules";

const REQUIRED = "Campo obrigatório";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  registration: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});
export type User = z.infer<typeof userSchema>;

export const paginatedUsersSchema = z.object({
  data: z.array(userSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});
export type PaginatedUsers = z.infer<typeof paginatedUsersSchema>;

const name = z
  .string()
  .trim()
  .min(1, REQUIRED)
  .max(USER_RULES.name.maxLength, `Máximo de ${USER_RULES.name.maxLength} caracteres`)
  .regex(USER_RULES.name.pattern, "Use apenas letras")
  .regex(USER_RULES.name.fullNamePattern, "Informe o nome completo (nome e sobrenome)");

const email = z
  .string()
  .trim()
  .min(1, REQUIRED)
  .max(USER_RULES.email.maxLength, `Máximo de ${USER_RULES.email.maxLength} caracteres`)
  .pipe(z.email("Informe um e-mail válido"));

const registration = z
  .string()
  .min(1, REQUIRED)
  .regex(USER_RULES.registration.pattern, "Use apenas números")
  .min(USER_RULES.registration.minLength, `Mínimo de ${USER_RULES.registration.minLength} números`)
  .max(USER_RULES.registration.maxLength, `Máximo de ${USER_RULES.registration.maxLength} números`);

const password = z
  .string()
  .regex(USER_RULES.password.pattern, "A senha deve ter 6 caracteres, apenas letras e números");

const passwordsMatch = (data: { password: string; confirmPassword: string }) =>
  data.password === data.confirmPassword;
const mismatch = { path: ["confirmPassword"], message: "As senhas não conferem" };

/** Cadastro: todos os campos obrigatórios. */
export const createUserSchema = z
  .object({
    name,
    registration,
    email,
    password: z.string().min(1, REQUIRED).pipe(password),
    confirmPassword: z.string().min(1, REQUIRED),
  })
  .refine(passwordsMatch, mismatch);

/**
 * Edição: a senha é opcional. Em branco mantém a atual (a API nunca devolve a
 * senha, então não há como pré-preencher); preenchida, segue a mesma regra.
 */
export const updateUserSchema = z
  .object({
    name,
    registration,
    email,
    password: z.union([z.literal(""), password]),
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, mismatch);

export type UserFormValues = z.input<typeof createUserSchema>;
