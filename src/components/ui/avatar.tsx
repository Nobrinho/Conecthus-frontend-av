import { cn } from "@/lib/utils";

/** Iniciais do primeiro e do último nome: "Millena Souza" → "MS". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-chrome text-chrome-fg ring-accent grid size-10 place-items-center rounded-full text-sm font-bold ring-2",
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
