import { Logo } from "@/components/brand/logo";

/** Tela de carregamento pós-login (telas 8 a 10): logo e barra de progresso. */
export function LoginTransition() {
  return (
    <div
      role="status"
      aria-label="Entrando no sistema"
      className="bg-chrome text-chrome-fg fixed inset-0 z-40 grid place-items-center"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-8 px-6">
        <Logo className="text-5xl md:text-6xl" />
        <div className="border-chrome-muted/60 h-4 w-full overflow-hidden rounded-sm border p-0.5">
          <div className="bg-accent animate-progress h-full origin-left rounded-xs" />
        </div>
      </div>
    </div>
  );
}
