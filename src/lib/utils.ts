import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * Ensina ao tailwind-merge os tamanhos de texto próprios do tema (definidos em
 * `globals.css`). Sem isso, `text-title` seria lido como cor e um
 * `cn("text-fg", "text-title")` descartaria a cor.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: { text: ["2xs", "title", "display", "hello", "welcome", "heading"] },
  },
});

/** Combina classes condicionais e resolve conflitos do Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
