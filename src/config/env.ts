import { z } from "zod";

/**
 * Variáveis públicas (expostas ao navegador). Cada uma precisa ser referenciada
 * literalmente (`process.env.NEXT_PUBLIC_X`) para o Next.js fazer o inline no build.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.url().default("https://jsonplaceholder.typicode.com"),
});

export const env = clientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
