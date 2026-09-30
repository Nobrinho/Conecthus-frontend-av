"use client";

import { Button } from "@/components/ui";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-surface shadow-card flex flex-1 flex-col items-center justify-center gap-4 rounded-xs p-10 text-center">
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="text-sm">
        Não foi possível carregar esta página. Verifique a conexão e tente de novo.
      </p>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
