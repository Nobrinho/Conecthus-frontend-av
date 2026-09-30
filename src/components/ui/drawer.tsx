"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Painel lateral (tela "Visualizar Usuário"). Também usa `<dialog>` nativo;
 * no celular ocupa a tela toda.
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
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "bg-surface text-fg shadow-overlay backdrop:bg-overlay p-0",
        "fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-none md:w-[24.5rem]",
      )}
    >
      {open && (
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between gap-4 px-6 pt-6 pb-2">
            <h2 id={titleId} className="text-xl font-bold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="text-fg hover:bg-surface-muted grid size-9 place-items-center rounded-full"
            >
              <X className="size-5" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          {footer && <footer className="flex justify-center px-6 pt-2 pb-6">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
