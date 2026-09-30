/**
 * Retorno padrão das Server Actions. Elas devolvem o resultado em vez de lançar
 * erro porque, em produção, o Next.js esconde a mensagem de erros lançados.
 */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });

export const fail = (
  error: string,
  fieldErrors?: Record<string, string[] | undefined>,
): ActionResult<never> => ({ ok: false, error, fieldErrors });
