import { cn } from "@/lib/utils";

/**
 * Logotipo "WenLock." em texto: "Wen" e o ponto na cor de destaque, "Lock" na
 * cor do texto ao redor (`currentColor`). Assim ele funciona sobre a sidebar
 * escura, sobre cartões claros e em qualquer tema.
 *
 * Exposto como imagem com nome acessível. Logotipos são isentos da exigência
 * de contraste (WCAG 1.4.3), por isso o teste de acessibilidade ignora o
 * atributo `data-logo` na regra de contraste.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="WenLock"
      data-logo
      className={cn("inline-flex items-baseline font-bold tracking-tight", className)}
    >
      <span aria-hidden className="text-accent">
        Wen
      </span>
      <span aria-hidden>Lock</span>
      <span aria-hidden className="bg-accent ml-[0.08em] inline-block size-[0.22em] rounded-full" />
    </span>
  );
}
