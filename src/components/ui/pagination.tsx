import Link from "next/link";

import { PageFirstIcon, PageLastIcon, PageNextIcon, PagePrevIcon } from "@/components/icons";

import { PageSizeSelect } from "./page-size-select";

export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  /** Tamanhos oferecidos em "Itens por página" (o primeiro é o padrão). */
  pageSizeOptions: readonly number[];
  /** Monta o link de cada página preservando os demais filtros. */
  hrefFor: (page: number) => string;
}

const navButton = "grid h-11 w-8 place-items-center rounded-[0.3125rem]";

/**
 * Rodapé da lista do protótipo: "Total de itens: N", "Itens por página 10" e a
 * navegação |‹ ‹ [n] › ›| "de N". Usa links (e não botões) para que cada
 * página tenha URL própria e funcione sem JavaScript.
 */
export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  pageSizeOptions,
  hrefFor,
}: PaginationProps) {
  const last = Math.max(totalPages, 1);
  const before = [
    { label: "Primeira página", icon: PageFirstIcon, target: 1, disabled: page <= 1 },
    { label: "Página anterior", icon: PagePrevIcon, target: page - 1, disabled: page <= 1 },
  ];
  const after = [
    { label: "Próxima página", icon: PageNextIcon, target: page + 1, disabled: page >= last },
    { label: "Última página", icon: PageLastIcon, target: last, disabled: page >= last },
  ];

  const renderNav = (list: typeof before) =>
    list.map(({ label, icon: Icon, target, disabled }) =>
      disabled ? (
        <span key={label} aria-hidden className={`${navButton} text-fg-muted opacity-60`}>
          <Icon className="size-full" />
        </span>
      ) : (
        <Link
          key={label}
          href={hrefFor(target)}
          aria-label={label}
          className={`${navButton} text-fg-muted hover:bg-control-hover hover:text-fg`}
        >
          <Icon className="size-full" />
        </Link>
      ),
    );

  return (
    <div className="text-fg flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm font-medium">
      <p>
        Total de itens: <strong>{total}</strong>
      </p>
      <nav aria-label="Paginação" className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <PageSizeSelect value={pageSize} options={pageSizeOptions} />
        <div className="flex items-center gap-1">
          {renderNav(before)}
          <span
            aria-current="page"
            className="bg-brand text-brand-fg grid h-11 min-w-[2.8125rem] place-items-center rounded-[0.3125rem] px-2 font-bold"
          >
            {page}
          </span>
          {renderNav(after)}
          <span className="ml-1 font-bold">de {last}</span>
        </div>
      </nav>
    </div>
  );
}
