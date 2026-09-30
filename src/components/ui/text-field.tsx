"use client";

import { useId, useState } from "react";

import { PasswordHideIcon, PasswordShowIcon } from "@/components/icons";
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
  /** Mensagem de erro exibida abaixo do campo (também marca o campo como inválido). */
  error?: string;
  /**
   * Marca o campo como inválido sem mensagem própria (ex.: login recusado,
   * quando a mensagem já está no toast).
   */
  invalid?: boolean;
  /**
   * - `filled` (padrão): fundo cinza e traço inferior, dos formulários de usuário;
   * - `outlined`: caixa branca com borda, das telas de acesso (login, recuperação).
   */
  appearance?: "filled" | "outlined";
  /** Mostra o botão de exibir/ocultar senha. */
  revealable?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

/*
 * O label "flutua" quando o campo tem foco ou valor. Como os inputs usam
 * `placeholder=" "`, `:placeholder-shown` indica campo vazio sem depender de JS.
 * (As classes ficam escritas por extenso para o Tailwind encontrá-las.)
 */
const WHEN_FLOATING_SHOW =
  "hidden group-focus-within:inline group-has-[input:not(:placeholder-shown)]:inline";
const WHEN_FLOATING_HIDE =
  "group-focus-within:hidden group-has-[input:not(:placeholder-shown)]:hidden";
const LABEL_ACTIVE_COLOR =
  "group-focus-within:text-brand group-has-[input:not(:placeholder-shown)]:text-brand";

const appearances = {
  filled: {
    box: "bg-surface-muted h-14 rounded-sm border-b-2 border-transparent",
    boxActive: "focus-within:border-brand has-[input:not(:placeholder-shown)]:border-brand",
    boxError: "border-b-danger-text",
    input: "px-4 pt-5 pb-1 text-lg",
    label:
      "left-4 text-lg group-focus-within:top-4 group-focus-within:text-xs group-focus-within:font-semibold " +
      "group-has-[input:not(:placeholder-shown)]:top-4 group-has-[input:not(:placeholder-shown)]:text-xs group-has-[input:not(:placeholder-shown)]:font-semibold",
  },
  outlined: {
    box: "bg-surface border-field-border h-[4.25rem] rounded-md border-2",
    boxActive:
      "focus-within:border-field-border-active has-[input:not(:placeholder-shown)]:border-field-border-active",
    boxError: "bg-danger-surface rounded-b-none border-transparent border-b-danger-text",
    input: "px-4 pt-6 pb-1.5 text-lg font-medium",
    label:
      "left-4 text-lg font-medium group-focus-within:top-5 group-focus-within:text-sm " +
      "group-has-[input:not(:placeholder-shown)]:top-5 group-has-[input:not(:placeholder-shown)]:text-sm",
  },
};

/**
 * Campo de texto do protótipo, com label flutuante e os estados do XD:
 * padrão, ativo/preenchido e erro (label, traço e mensagem em vermelho).
 */
export function TextField({
  label,
  placeholderLabel,
  hint,
  error,
  invalid,
  appearance = "filled",
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
  const styles = appearances[appearance];
  const hasError = Boolean(error) || Boolean(invalid);

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div
        className={cn(
          "group relative flex items-center transition-colors",
          styles.box,
          hasError ? styles.boxError : styles.boxActive,
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type={revealable && revealed ? "text" : type}
          placeholder=" "
          required={required}
          aria-label={placeholderLabel ? label : undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy || undefined}
          className={cn("text-fg h-full w-full min-w-0 bg-transparent outline-none", styles.input)}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "text-fg-muted pointer-events-none absolute top-1/2 max-w-[calc(100%-2rem)] -translate-y-1/2 truncate transition-all",
            styles.label,
            hasError ? "text-danger-text" : LABEL_ACTIVE_COLOR,
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
            className="text-fg-muted hover:text-fg mr-2 grid size-10 shrink-0 place-items-center rounded-full"
          >
            {revealed ? (
              <PasswordHideIcon className="size-6" />
            ) : (
              <PasswordShowIcon className="size-6" />
            )}
          </button>
        )}
      </div>
      {(error || hint) && (
        // Fica sob o campo sem empurrar o layout (os formulários reservam o espaço).
        <div className="absolute inset-x-0 top-full flex items-start justify-between gap-3 pt-0.5">
          {error ? (
            <p id={errorId} className="text-danger-text text-xs font-medium">
              {error}
            </p>
          ) : (
            <span />
          )}
          {hint && (
            <p id={hintId} className="text-fg text-2xs shrink-0 text-right font-medium">
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
