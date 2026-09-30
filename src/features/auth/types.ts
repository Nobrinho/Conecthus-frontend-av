import { z } from "zod";

/** A mesma regra de senha do cadastro de usuários (6 caracteres alfanuméricos). */
const PASSWORD_PATTERN = /^[A-Za-z0-9]{6}$/;
const REQUIRED = "Campo Obrigatório";

export const loginSchema = z.object({
  login: z.string().trim().min(1, REQUIRED),
  password: z.string().min(1, REQUIRED),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, REQUIRED).pipe(z.email("Informe um e-mail válido")),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(1, REQUIRED)
      .regex(PASSWORD_PATTERN, "A senha deve ter 6 caracteres, apenas letras e números"),
    confirmPassword: z.string().min(1, REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/** Usuário da sessão, como devolvido por `GET /auth/me`. */
export const sessionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

export const authResponseSchema = z.object({
  user: sessionUserSchema,
  tokens: z.object({ accessToken: z.string(), refreshToken: z.string() }),
});
