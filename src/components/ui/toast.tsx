"use client";

import { cva } from "class-variance-authority";
import { AlertCircle, CheckCircle2, TriangleAlert, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type ToastTone = "success" | "danger" | "warning";

interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastApi {
  show: (tone: ToastTone, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DURATION_MS = 4000;

const toastVariants = cva(
  "animate-toast-in shadow-raised pointer-events-auto flex w-full items-center gap-3 px-4 py-3 text-sm font-bold md:w-[22rem]",
  {
    variants: {
      tone: {
        success: "bg-success text-success-fg",
        danger: "bg-danger text-danger-fg",
        warning: "bg-warning text-warning-fg",
      },
    },
  },
);

const icons = { success: CheckCircle2, danger: AlertCircle, warning: TriangleAlert };

/**
 * Toasts do protótipo: faixa colorida no canto superior direito, com ícone e
 * botão de fechar. Anunciados por leitores de tela via região `aria-live`.
 * O provider fica no layout raiz para sobreviver às navegações (ex.: o toast
 * de "Cadastro Realizado!" aparece já na tela da lista).
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const show = useCallback(
    (tone: ToastTone, message: string) => {
      const id = ++nextId.current;
      setItems((current) => [...current.slice(-2), { id, tone, message }]);
      setTimeout(() => dismiss(id), DURATION_MS);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (message) => show("success", message),
      error: (message) => show("danger", message),
      warning: (message) => show("warning", message),
    }),
    [show],
  );

  return (
    <ToastContext value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-end gap-2 md:top-8"
      >
        {items.map((item) => {
          const Icon = icons[item.tone];
          return (
            <div
              key={item.id}
              role={item.tone === "danger" ? "alert" : "status"}
              className={toastVariants({ tone: item.tone })}
            >
              <Icon aria-hidden className="size-5 shrink-0" />
              <p className="flex-1">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Fechar aviso"
                className="grid size-7 place-items-center rounded-full hover:bg-current/10"
              >
                <X className="size-5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast precisa estar dentro de <ToastProvider>");
  return context;
}
