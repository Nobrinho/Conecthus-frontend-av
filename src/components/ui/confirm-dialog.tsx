"use client";

import { useId } from "react";

import { Button } from "./button";
import { Dialog } from "./dialog";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmação "Não / Sim" dos modais de cancelar e excluir do protótipo. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Sim",
  cancelLabel = "Não",
  pending,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Dialog open={open} onClose={onCancel} labelledBy={titleId} describedBy={descriptionId}>
      <div className="flex min-h-[15.625rem] flex-col items-center justify-center px-6 py-8 text-center">
        <h2 id={titleId} className="text-heading font-bold">
          {title}
        </h2>
        <p id={descriptionId} className="mt-4 text-lg font-medium">
          {description}
        </p>
        <div className="mt-8 flex gap-2">
          <Button variant="outline" className="min-w-[7.875rem]" onClick={onCancel} autoFocus>
            {cancelLabel}
          </Button>
          <Button className="min-w-[7.75rem]" onClick={onConfirm} disabled={pending}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
