"use client";

import { CloseIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

/** Pesquisa do protótipo: caixa branca com borda fina; hover cinza; ativa com a borda escura. */
export function SearchInput({
  value,
  onValueChange,
  label = "Pesquisa",
  className,
  ...props
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "bg-surface shadow-card border-search-border relative flex h-14 items-center gap-2 rounded-[0.4375rem] border px-4",
        "hover:bg-control-hover focus-within:border-brand focus-within:bg-surface transition-colors",
        value && "border-brand",
        className,
      )}
    >
      <SearchIcon className="text-fg size-6 shrink-0" />
      <input
        type="search"
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="text-fg placeholder:text-fg h-full w-full min-w-0 bg-transparent text-base font-medium outline-none [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          aria-label="Limpar pesquisa"
          className="text-fg-muted hover:text-fg grid size-8 shrink-0 place-items-center rounded-full"
        >
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
