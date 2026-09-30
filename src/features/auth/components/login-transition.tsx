import { Logo } from "@/components/brand/logo";

/** Tela de carregamento pós-login (telas 8 a 10): logo e barra de progresso. */
export function LoginTransition() {
  return (
    <div
      role="status"
      aria-label="Entrando no sistema"
      className="bg-chrome text-chrome-fg fixed inset-0 z-40 grid place-items-center"
    >
      <div className="flex w-full max-w-[49.35rem] flex-col items-center gap-16 px-6">
        <Logo className="h-14 md:h-[4.75rem]" />
        <div className="border-chrome-fg flex h-[2.3125rem] w-full items-center overflow-hidden rounded-lg border-2 px-4">
          <div className="bg-accent animate-progress h-1 w-full origin-left rounded-full" />
        </div>
      </div>
    </div>
  );
}
