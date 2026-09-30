import { cn } from "@/lib/utils";

/** Iniciais do primeiro e do último nome: "Millena Souza" → "MS". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

/** Avatar com iniciais (o protótipo usa foto; aqui as iniciais fazem esse papel). */
export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-chrome text-chrome-fg grid size-[3.125rem] shrink-0 place-items-center rounded-full text-base font-bold",
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
