"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  /**
   * Texto exibido enquanto o campo está vazio e sem foco (ex.: "Insira o nome
   * completo"). Ao focar ou preencher, dá lugar ao `label` flutuante. O nome
   * acessível do campo é sempre o `label`.
   */
  placeholderLabel?: string;
  /** Dica fixa exibida abaixo do campo, como "Máx. 30 caracteres". */
  hint?: string;
  error?: string;
  /** Mostra o botão de exibir/ocultar senha. */
  revealable?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

/*
 * O campo "flutua" o label quando tem foco ou valor. Como os inputs usam
 * `placeholder=" "`, `:placeholder-shown` indica campo vazio sem depender de JS.
 */
const FLOATING_LABEL =
  "group-focus-within:top-3.5 group-focus-within:text-xs group-focus-within:font-semibold " +
  "group-has-[input:not(:placeholder-shown)]:top-3.5 group-has-[input:not(:placeholder-shown)]:text-xs group-has-[input:not(:placeholder-shown)]:font-semibold";
const WHEN_FLOATING_SHOW =
  "hidden group-focus-within:inline group-has-[input:not(:placeholder-shown)]:inline";
const WHEN_FLOATING_HIDE =
  "group-focus-within:hidden group-has-[input:not(:placeholder-shown)]:hidden";

/**
 * Campo de texto do protótipo: fundo cinza, label flutuante, traço inferior na
 * cor da marca quando ativo/preenchido e vermelho quando há erro.
 */
export function TextField({
  label,
  placeholderLabel,
  hint,
  error,
  revealable,
  type = "text",
  className,
  id,
  required,
  ref,
  ...props
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const [revealed, setRevealed] = useState(false);

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "group bg-surface-muted relative flex items-center rounded-t-xs border-b-2 border-transparent transition-colors",
          error
            ? "border-danger"
            : "focus-within:border-brand has-[input:not(:placeholder-shown)]:border-brand",
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type={revealable && revealed ? "text" : type}
          placeholder=" "
          required={required}
          aria-label={placeholderLabel ? label : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className="text-fg h-14 w-full min-w-0 bg-transparent px-3 pt-5 pb-1.5 text-base outline-none"
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "text-fg-muted pointer-events-none absolute top-1/2 left-3 max-w-[calc(100%-1.5rem)] -translate-y-1/2 truncate text-base transition-all",
            FLOATING_LABEL,
            error
              ? "group-focus-within:text-danger group-has-[input:not(:placeholder-shown)]:text-danger"
              : "group-focus-within:text-brand group-has-[input:not(:placeholder-shown)]:text-brand",
          )}
        >
          {placeholderLabel ? (
            <>
              <span aria-hidden className={WHEN_FLOATING_SHOW}>
                {label}
              </span>
              <span aria-hidden className={WHEN_FLOATING_HIDE}>
                {placeholderLabel}
                {required && "*"}
              </span>
            </>
          ) : (
            <>
              {label}
              {required && <span aria-hidden>*</span>}
            </>
          )}
        </label>
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={revealed}
            className="text-fg-muted hover:text-fg mr-1 grid size-10 shrink-0 place-items-center rounded-full"
          >
            {revealed ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        )}
      </div>
      <div className="flex min-h-4 items-start justify-between gap-3">
        {error ? (
          <p id={errorId} className="text-danger text-xs font-medium">
            {error}
          </p>
        ) : (
          <span />
        )}
        {hint && (
          <p id={hintId} className="text-fg-muted shrink-0 text-right text-[0.625rem] leading-4">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
