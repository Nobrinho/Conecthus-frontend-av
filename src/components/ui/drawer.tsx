"use client";

import { useEffect, useId, useRef } from "react";

import { CloseIcon } from "@/components/icons";

import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Painel lateral (tela "Visualizar Usuário"), sobre o `<dialog>` nativo.
 * Desliza da direita e desfoca o resto da tela (classe `drawer-slide` e o
 * `::backdrop` em `globals.css`). O conteúdo continua montado durante a
 * animação de saída. No celular ocupa a tela toda.
 */
export function Drawer({ open, onClose, title, footer, children }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={open ? titleId : undefined}
      data-state={open ? "open" : "closed"}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "drawer-slide bg-surface text-fg shadow-overlay p-0",
        "fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-none md:w-[38.375rem]",
      )}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-4 px-6 pt-6 pb-2 md:pr-5 md:pl-[2.1875rem]">
          <h2 id={titleId} className="text-2xl font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel"
            className="text-fg-muted hover:bg-control-hover hover:text-fg grid size-10 place-items-center rounded-full transition-colors"
          >
            <CloseIcon className="size-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4 md:px-[2.1875rem]">{children}</div>
        {footer && <footer className="flex justify-center px-6 pt-2 pb-5">{footer}</footer>}
      </div>
    </dialog>
  );
}
