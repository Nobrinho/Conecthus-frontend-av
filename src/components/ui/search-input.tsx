"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

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
        "bg-surface shadow-card relative flex h-11 items-center gap-2 rounded-xs border border-transparent px-3",
        "focus-within:border-brand",
        value && "border-brand",
        className,
      )}
    >
      <Search aria-hidden className="text-fg size-4 shrink-0" />
      <input
        type="search"
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="text-fg placeholder:text-fg-muted h-full w-full min-w-0 bg-transparent text-sm outline-none [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          aria-label="Limpar pesquisa"
          className="text-fg-muted hover:text-fg grid size-7 place-items-center rounded-full"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
