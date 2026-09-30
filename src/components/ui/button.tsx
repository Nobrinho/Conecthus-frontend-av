import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm font-bold whitespace-nowrap",
    "transition-colors duration-150 select-none",
    "disabled:pointer-events-none disabled:bg-surface-muted disabled:text-fg-muted disabled:border-transparent",
  ],
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-fg hover:bg-brand-hover",
        outline: "border border-fg bg-surface text-fg hover:bg-surface-muted",
        ghost: "bg-transparent text-fg hover:bg-surface-muted",
        link: "bg-transparent px-0 text-brand underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
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
