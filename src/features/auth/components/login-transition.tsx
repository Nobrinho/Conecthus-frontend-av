import { Logo } from "@/components/brand/logo";

/** Tela de carregamento pós-login (telas 8 a 10): logo e barra de progresso. */
export function LoginTransition() {
  return (
    <div
      role="status"
      aria-label="Entrando no sistema"
      className="bg-chrome text-chrome-fg fixed inset-0 z-40 grid place-items-center"
    >
      <div className="flex w-full max-w-[35.25rem] flex-col items-center gap-16 px-6 md:gap-80">
        <Logo className="h-14 md:h-[4.75rem]" />
        <div className="border-chrome-fg h-[2.3125rem] w-full overflow-hidden rounded-lg border-2 p-1.5">
          <div className="bg-accent animate-progress h-full origin-left rounded-sm" />
        </div>
      </div>
    </div>
  );
}
