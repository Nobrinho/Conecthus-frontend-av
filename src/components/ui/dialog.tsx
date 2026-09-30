"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Id do título, para `aria-labelledby`. */
  labelledBy: string;
  describedBy?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Modal sobre o `<dialog>` nativo: `showModal()` já entrega foco preso,
 * fundo inerte, fechamento com Esc e retorno do foco ao elemento que abriu.
 * O fundo é desfocado e a entrada/saída anima só com CSS (`dialog-pop`).
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  className,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      // Fechado, o conteúdo segue montado (para animar a saída), mas sem nome
      // acessível, para não competir com os rótulos da página.
      aria-labelledby={open ? labelledBy : undefined}
      aria-describedby={open ? describedBy : undefined}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Clique no backdrop (fora do conteúdo) fecha.
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "dialog-pop bg-surface text-fg shadow-overlay m-auto rounded-md p-0",
        "max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[29.875rem]",
        className,
      )}
    >
      {children}
    </dialog>
  );
}
