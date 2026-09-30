import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export interface AuthShellProps {
  /** Conteúdo do lado esquerdo em telas médias ou maiores (logo grande ou ilustração). */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Anima a entrada (logo e cartão) depois da `Splash`. */
  intro?: boolean;
}

/**
 * Moldura das telas públicas: fundo escuro de marca, destaque à esquerda e o
 * cartão do formulário à direita (medidas do XD em 1920: logo 612 px, cartão
 * 764×800). No celular sobra só o cartão, com o logo acima.
 */
export function AuthShell({ aside, children, className, intro }: AuthShellProps) {
  return (
    <main className="bg-chrome text-chrome-fg flex min-h-dvh items-center justify-center p-4 md:p-8 xl:py-10">
      {/* Em 1920 o conteúdo ocupa a tela toda (medidas do XD); acima disso fica
          centralizado nessa mesma largura, sem afastar o logo do cartão. */}
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-12 xl:mx-auto xl:w-[120rem] xl:max-w-full xl:justify-between xl:gap-8 xl:pr-[6.9375rem] xl:pl-[14.6875rem]">
        <div className="flex shrink justify-center">
          <div data-auth-logo className={cn("hidden lg:block", intro && "animate-reveal-logo")}>
            {aside ?? <Logo className="h-12 lg:h-14 xl:h-[5.9375rem]" />}
          </div>
          <div data-auth-logo className={cn("lg:hidden", intro && "animate-reveal-logo")}>
            <Logo className="h-10" />
          </div>
        </div>
        <section
          className={cn(
            intro && "animate-form-in",
            "bg-surface text-fg shadow-overlay w-full max-w-[47.75rem] shrink-0 rounded-xl px-6 py-10 md:px-[3.5625rem] md:pt-12 md:pb-14 lg:w-[min(47.75rem,55vw)] xl:min-h-[50rem]",
            className,
          )}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
