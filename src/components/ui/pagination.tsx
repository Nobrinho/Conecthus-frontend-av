import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  /** Monta o link de cada página preservando os demais filtros. */
  hrefFor: (page: number) => string;
}

/**
 * Rodapé da lista do protótipo: "Total de itens N", "Itens por página 15" e a
 * navegação ⏮ ‹ [n] › ⏭ "de N". Usa links (e não botões) para que cada página
 * tenha URL própria e funcione sem JavaScript.
 */
export function Pagination({ page, totalPages, total, pageSize, hrefFor }: PaginationProps) {
  const last = Math.max(totalPages, 1);
  const items = [
    { label: "Primeira página", icon: ChevronFirst, target: 1, disabled: page <= 1 },
    { label: "Página anterior", icon: ChevronLeft, target: page - 1, disabled: page <= 1 },
  ];
  const after = [
    { label: "Próxima página", icon: ChevronRight, target: page + 1, disabled: page >= last },
    { label: "Última página", icon: ChevronLast, target: last, disabled: page >= last },
  ];

  const renderNav = (list: typeof items) =>
    list.map(({ label, icon: Icon, target, disabled }) =>
      disabled ? (
        <span key={label} aria-hidden className="text-fg-muted/50 grid size-8 place-items-center">
          <Icon className="size-4" />
        </span>
      ) : (
        <Link
          key={label}
          href={hrefFor(target)}
          aria-label={label}
          className="text-fg hover:bg-surface-muted grid size-8 place-items-center rounded-full"
        >
          <Icon className="size-4" />
        </Link>
      ),
    );

  return (
    <div className="text-fg flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs">
      <p>
        Total de itens <strong>{total}</strong>
      </p>
      <nav aria-label="Paginação" className="flex items-center gap-4">
        <p className="hidden md:block">
          Itens por página <strong>{pageSize}</strong>
        </p>
        <div className="flex items-center gap-1">
          {renderNav(items)}
          <span
            aria-current="page"
            className={cn(
              "bg-brand text-brand-fg grid size-8 place-items-center rounded-xs font-bold",
            )}
          >
            {page}
          </span>
          {renderNav(after)}
          <span className="ml-1">
            de <strong>{last}</strong>
          </span>
        </div>
      </nav>
    </div>
  );
}
