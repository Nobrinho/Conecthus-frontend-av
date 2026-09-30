import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Botões do protótipo (medidas e estados dos componentes do XD):
 * - `primary`: fundo da marca; hover escurece (`brand-hover`);
 * - `cta`: botões grandes das telas de acesso ("Entrar", "Recuperar"), com o
 *   hover verde-escuro próprio deles;
 * - `outline`: "Cancelar", "Não", "Fechar"; hover com fundo translúcido;
 * - desabilitado: cinza, como o "Cadastrar"/"Salvar" antes de preencher.
 */
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-bold whitespace-nowrap",
    "transition-colors duration-150 select-none",
    "disabled:pointer-events-none disabled:border-transparent disabled:bg-disabled disabled:text-disabled-fg",
  ],
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-fg hover:bg-brand-hover",
        cta: "bg-brand text-brand-fg hover:bg-brand-hover-strong",
        outline: "border-fg text-fg hover:bg-brand-soft border bg-transparent",
        ghost: "text-fg hover:bg-control-hover bg-transparent",
        link: "text-brand hover:text-brand-hover bg-transparent px-0",
      },
      size: {
        sm: "h-11 px-4 text-base",
        md: "h-14 px-6 text-lg",
        lg: "h-[4.25rem] px-8 text-2xl",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
