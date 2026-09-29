/** Tipos globais compartilhados entre features. Tipos de domínio ficam em cada feature. */
export type WithChildren<T = unknown> = T & { children: React.ReactNode };
