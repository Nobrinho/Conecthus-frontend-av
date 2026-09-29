import "server-only";

import { z } from "zod";

/**
 * Variáveis exclusivas do servidor (segredos). O import de "server-only" faz o build
 * falhar se este arquivo for importado por um Client Component.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Token opcional enviado às chamadas de API feitas pelo servidor. */
  API_TOKEN: z.string().min(1).optional(),
});

export const serverEnv = serverSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  API_TOKEN: process.env.API_TOKEN,
});
