"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useTransition } from "react";

export interface PageSizeSelectProps {
  value: number;
  options: readonly number[];
  /** Parâmetro da URL que guarda o tamanho da página. */
  param?: string;
}

/**
 * "Itens por página": troca o tamanho na URL (`?limit=`) e volta para a
 * primeira página, preservando os demais filtros (ex.: a busca).
 */
export function PageSizeSelect({ value, options, param = "limit" }: PageSizeSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const id = useId();

  function change(next: number) {
    const params = new URLSearchParams(searchParams);
    if (next === options[0]) params.delete(param);
    else params.set(param, String(next));
    params.delete("page");
    const query = params.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname));
  }

  return (
    <label htmlFor={id} className="flex items-center gap-2">
      Itens por página
      <select
        id={id}
        value={value}
        onChange={(event) => change(Number(event.target.value))}
        className="hover:bg-control-hover cursor-pointer rounded-xs bg-transparent py-1 font-bold"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
