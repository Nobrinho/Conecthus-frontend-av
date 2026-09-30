import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui";
import { routes } from "@/config/routes";

export default function NotFound() {
  return (
    <main className="bg-chrome text-chrome-fg flex min-h-dvh flex-col items-center justify-center gap-6 p-10 text-center">
      <Logo className="text-fg h-10" />
      <h1 className="text-5xl font-bold">404</h1>
      <p>Página não encontrada.</p>
      <Link href={routes.home} className={buttonVariants()}>
        Voltar para o início
      </Link>
    </main>
  );
}
