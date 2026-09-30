import { Logo } from "@/components/brand/logo";

/**
 * Splash do protótipo (telas 1 e 2). Só CSS: aparece na carga da página de
 * login e some sozinho em ~1,5s, sem JavaScript e sem atrasar a hidratação.
 * Com "reduzir movimento" ligado, a animação é praticamente instantânea.
 */
export function Splash() {
  return (
    <div
      aria-hidden
      className="bg-chrome text-chrome-fg animate-splash pointer-events-none fixed inset-0 z-40 grid place-items-center"
    >
      <Logo className="text-5xl md:text-7xl" />
    </div>
  );
}
