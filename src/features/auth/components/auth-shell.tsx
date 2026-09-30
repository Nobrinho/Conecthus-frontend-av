import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export interface AuthShellProps {
  /** Conteúdo do lado esquerdo em telas médias ou maiores (logo grande ou ilustração). */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Moldura das telas públicas: fundo escuro de marca, destaque à esquerda e o
 * cartão do formulário à direita. No celular sobra só o cartão, com o logo acima.
 */
export function AuthShell({ aside, children, className }: AuthShellProps) {
  return (
    <main className="bg-chrome text-chrome-fg flex min-h-dvh items-center justify-center p-4 md:p-8">
      <div className="grid w-full max-w-[75rem] items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex justify-center">
          <div className="hidden md:block">
            {aside ?? <Logo className="text-7xl xl:text-8xl" />}
          </div>
          <Logo className="text-4xl md:hidden" />
        </div>
        <section
          className={cn(
            "bg-surface text-fg shadow-overlay mx-auto w-full max-w-[28.5rem] rounded-sm px-6 py-10 md:min-h-[31.5rem] md:px-10 md:py-12",
            className,
          )}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
