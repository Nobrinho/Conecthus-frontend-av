import { cn } from "@/lib/utils";

/*
 * Logotipo do protótipo, com os vetores do Adobe XD. "Wen" e o ponto usam a
 * cor de destaque; "Lock" usa `currentColor`, então o logo funciona sobre a
 * sidebar escura, sobre cartões claros e em qualquer tema.
 *
 * Exposto como imagem com nome acessível. Logotipos são isentos da exigência
 * de contraste (WCAG 1.4.3), por isso o teste de acessibilidade ignora o
 * atributo `data-logo` na regra de contraste.
 *
 * O tamanho vem da altura (ex.: `className="h-9"`); a largura acompanha.
 */

/** "W", em coordenadas do artboard (compensadas no `transform`). */
const W =
  "m80.28 43.49-6.91 25.16-6.95-25.16-6.12.05-6.92 25.1-6.94-25.15h-6.12L50.5 78.33h5.76l7.09-24.78 7.14 24.78h5.75L86.4 43.49z";
const EN =
  "M59 35.56q-3.96 0-6.96-1.71-3-1.73-4.68-4.77a14 14 0 0 1-1.68-7.02q0-4.27 1.64-7.44 1.65-3.15 4.57-4.9a13 13 0 0 1 6.78-1.74q4.05 0 6.9 1.9 2.84 1.9 4.22 5.36t1.05 8.15h-5.79v-2.13q-.02-4.25-1.5-6.21-1.47-1.95-4.64-1.96-3.58 0-5.32 2.21-1.75 2.22-1.75 6.47 0 3.97 1.75 6.15 1.74 2.18 5.08 2.18 2.15 0 3.71-.96a6.3 6.3 0 0 0 2.4-2.77l5.77 1.74a11.7 11.7 0 0 1-4.64 5.5 13 13 0 0 1-6.9 1.95M50 19h17.97v4.4H50.01zm25.48 15.84V8.7h5.2v8.1h.7v18.03zm18.12 0V22.26q0-1.24-.17-2.74a10 10 0 0 0-.79-2.89 5.6 5.6 0 0 0-1.83-2.28q-1.23-.9-3.3-.9-1.12 0-2.2.36-1.1.37-1.98 1.25a6 6 0 0 0-1.41 2.42 12 12 0 0 0-.54 3.93l-3.46-1.48q0-3.33 1.3-6.04t3.8-4.32a11.3 11.3 0 0 1 6.2-1.61q2.9 0 4.8.97a8.5 8.5 0 0 1 3 2.47q1.1 1.5 1.64 3.19.53 1.7.69 3.2.15 1.52.15 2.46v14.59z";
const L = "M106.28 34.84V0h5.83v29.37h15.38v5.47z";
const OCK =
  "M143.15 35.56a13 13 0 0 1-6.85-1.76 12 12 0 0 1-4.54-4.88 15 15 0 0 1-1.6-7.15q0-4.11 1.64-7.2a12 12 0 0 1 4.57-4.84 13 13 0 0 1 6.78-1.75q3.93 0 6.87 1.77a12 12 0 0 1 4.54 4.87 15 15 0 0 1 1.62 7.15q0 4.06-1.63 7.18A12 12 0 0 1 150 33.8a13 13 0 0 1-6.84 1.75m0-5.46q3.48 0 5.17-2.33 1.7-2.32 1.7-6 0-3.8-1.72-6.06-1.73-2.26-5.15-2.26a6.6 6.6 0 0 0-3.86 1.05q-1.52 1.05-2.24 2.93t-.73 4.34q0 3.81 1.73 6.06 1.73 2.27 5.1 2.27m29.69 5.47q-4.03 0-6.9-1.8a12 12 0 0 1-4.36-4.92q-1.5-3.12-1.53-7.07a16 16 0 0 1 1.58-7.12 12 12 0 0 1 4.44-4.89 13 13 0 0 1 6.85-1.78q4.45 0 7.53 2.24a10.3 10.3 0 0 1 4.03 6.11l-5.8 1.57a6.4 6.4 0 0 0-2.26-3.28 6 6 0 0 0-3.58-1.17 6.2 6.2 0 0 0-3.75 1.08 6.3 6.3 0 0 0-2.17 2.96 12 12 0 0 0-.7 4.28q0 3.73 1.66 6.03 1.68 2.3 4.96 2.3 2.32 0 3.67-1.07a6.4 6.4 0 0 0 2.02-3.07l5.95 1.33q-1.2 3.99-4.23 6.13a12.5 12.5 0 0 1-7.4 2.14m16.44-.72L189.35 0h5.9v21.29l9.56-12.58h7.28l-10.13 13.06 11 13.07h-7.71l-10-12.58v12.58z";
const DOT = "M234.68 29.1a7.28 7.28 0 1 1-14.56 0 7.28 7.28 0 0 1 14.56 0";

export interface LogoProps {
  className?: string;
  /** Versão "WL." da sidebar recolhida. */
  compact?: boolean;
}

export function Logo({ className, compact }: LogoProps) {
  return (
    <svg
      role="img"
      aria-label="WenLock"
      data-logo
      viewBox={compact ? "0 0 72 48" : "0 0 234.68 36.39"}
      className={cn("h-9 w-auto shrink-0", className)}
    >
      <path fill="var(--accent)" d={W} transform="translate(-40.32 -43.49)" />
      {compact ? (
        <>
          <path fill="currentColor" d={L} transform="translate(-56 0)" />
          <circle fill="var(--accent)" cx="44" cy="43" r="4.6" />
        </>
      ) : (
        <>
          <path fill="var(--accent)" d={EN} />
          <path fill="currentColor" d={L} />
          <path fill="currentColor" d={OCK} />
          <path fill="var(--accent)" d={DOT} />
        </>
      )}
    </svg>
  );
}
