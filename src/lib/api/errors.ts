import { z } from "zod";

/** Envelope de erro devolvido pela API (ErrorResponseDto do backend). */
const errorBodySchema = z.object({
  statusCode: z.number(),
  message: z.union([z.string(), z.array(z.string())]),
  field: z.string().optional(),
});

export type ApiErrorBody = z.infer<typeof errorBodySchema>;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** Corpo tipado quando a API respondeu no formato padrão de erro. */
  get details(): ApiErrorBody | undefined {
    const parsed = errorBodySchema.safeParse(this.body);
    return parsed.success ? parsed.data : undefined;
  }

  /** Primeira mensagem legível para exibir ao usuário. */
  get userMessage(): string | undefined {
    const message = this.details?.message;
    return Array.isArray(message) ? message[0] : message;
  }
}
