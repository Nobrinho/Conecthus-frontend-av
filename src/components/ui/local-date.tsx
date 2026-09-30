"use client";

import { useId } from "react";

/*
 * Data no fuso e no relógio de quem está vendo. O servidor não sabe o fuso do
 * navegador, então segue o padrão do Next para conteúdo dependente do cliente
 * (guia "Preventing flash before hydration"):
 *
 * - carga completa: o servidor manda um valor provisório e um script inline
 *   reescreve o texto antes da primeira pintura; `suppressHydrationWarning`
 *   faz o React aceitar o DOM (vale só para o texto deste elemento);
 * - navegação no cliente: o componente já renderiza no navegador, com o fuso
 *   certo, e o script (com `type="text/plain"`) é ignorado.
 *
 * O formatador precisa ser autocontido: o código dele vai para o script inline.
 */

/** "22, Novembro 2024", como no card de boas-vindas do protótipo. */
function formatLong(date: Date): string {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const month = get("month");
  return get("day") + ", " + month.charAt(0).toUpperCase() + month.slice(1) + " " + get("year");
}

const formats = { long: formatLong };

export interface LocalDateProps {
  /** Instante em ISO 8601 (UTC). */
  date: string;
  format?: keyof typeof formats;
  className?: string;
}

export function LocalDate({ date, format = "long", className }: LocalDateProps) {
  const id = useId();
  const formatter = formats[format];
  const script = `{var n=document.getElementById(${JSON.stringify(id)});if(n)n.textContent=(${formatter.toString()})(new Date(${JSON.stringify(date)}))}`;

  return (
    <>
      <time id={id} dateTime={date} className={className} suppressHydrationWarning>
        {formatter(new Date(date))}
      </time>
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: script }}
      />
    </>
  );
}
