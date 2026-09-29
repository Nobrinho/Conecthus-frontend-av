"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ponto de integração com serviço de monitoramento (Sentry, Datadog...).
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4 py-20 text-center">
      <h2 className="text-xl font-semibold">Algo deu errado.</h2>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
