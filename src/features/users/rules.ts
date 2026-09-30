/**
 * Regras do cadastro de usuário — espelho de `src/modules/users/user.rules.ts`
 * no backend. O PDF da avaliação define o tipo de cada campo; o protótipo
 * define os limites de tamanho que aparecem embaixo dos campos.
 */
export const USER_RULES = {
  name: {
    maxLength: 30,
    pattern: /^\p{L}+(?: \p{L}+)*$/u,
    /** "Nome Completo": ao menos nome e sobrenome. */
    fullNamePattern: /^\p{L}+(?: \p{L}+)+$/u,
  },
  email: { maxLength: 40 },
  registration: { minLength: 4, maxLength: 10, pattern: /^\d+$/ },
  password: { length: 6, pattern: /^[A-Za-z0-9]{6}$/ },
} as const;

/** Mantém só letras e espaços simples; o nome nunca começa com espaço. */
export function sanitizeName(value: string): string {
  return value
    .replace(/[^\p{L} ]/gu, "")
    .replace(/ {2,}/g, " ")
    .replace(/^ /, "")
    .slice(0, USER_RULES.name.maxLength);
}

/** Mantém só dígitos. */
export function sanitizeRegistration(value: string): string {
  return value.replace(/\D/g, "").slice(0, USER_RULES.registration.maxLength);
}

/** "Itens por página" da lista (o primeiro é o padrão). A API aceita até 100. */
export const USERS_PAGE_SIZES = [10, 50, 80, 100] as const;

/** Lê `?limit=` aceitando só os tamanhos oferecidos. */
export function parsePageSize(value: unknown): number {
  const size = Number(value);
  return (USERS_PAGE_SIZES as readonly number[]).includes(size) ? size : USERS_PAGE_SIZES[0];
}
