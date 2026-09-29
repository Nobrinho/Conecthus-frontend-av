"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "sans-serif", textAlign: "center", padding: "5rem 1rem" }}>
        <h2>Algo deu errado.</h2>
        <button type="button" onClick={() => reset()}>
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
