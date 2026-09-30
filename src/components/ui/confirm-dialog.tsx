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
      <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
        <h2 id={titleId} className="text-xl font-bold">
          {title}
        </h2>
        <p id={descriptionId} className="text-sm">
          {description}
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="min-w-20" onClick={onCancel} autoFocus>
            {cancelLabel}
          </Button>
          <Button size="sm" className="min-w-20" onClick={onConfirm} disabled={pending}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
