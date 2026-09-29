import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Página não encontrada.</p>
      <Link href="/" className="underline">
        Voltar para o início
      </Link>
    </main>
  );
}
