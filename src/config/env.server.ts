import "server-only";

import { z } from "zod";

/**
 * Variáveis exclusivas do servidor. O import de "server-only" faz o build
 * falhar se este arquivo for importado por um Client Component.
 *
 * A URL da API fica só no servidor de propósito: o navegador conversa apenas
 * com o Next (Server Components e Server Actions), que chama a API com o token
 * guardado em cookie httpOnly. O token nunca fica acessível ao JavaScript.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Base da API NestJS, incluindo prefixo e versão. */
  API_URL: z.url().default("http://localhost:3000/api/v1"),
});

export const serverEnv = serverSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.API_URL,
});
