"use client";

import { useEffect, useRef } from "react";

import { Logo } from "@/components/brand/logo";

/*
 * Linha do tempo da abertura (ms). Os mesmos tempos estão em globals.css
 * (`--animate-splash`, `--animate-reveal-logo`, `--animate-form-in`).
 */
const HOLD_MS = 1400;
const TRAVEL_MS = 800;

/**
 * Abertura do protótipo (telas 1 e 2): o logo surge em tela cheia com fade in
 * e, depois, desliza do centro até a posição que ocupa na tela de login (à
 * esquerda) enquanto o cartão do formulário desliza para a direita. O logo
 * real do `AuthShell` fica invisível até o fim do trajeto, então a troca é
 * imperceptível. Sem JavaScript o logo apenas some no centro e o real aparece.
 */
export function Splash() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = [...document.querySelectorAll<HTMLElement>("[data-auth-logo]")].find(
      (el) => el.getClientRects().length > 0,
    );
    if (!target) return;

    const from = logo.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);

    const animation = logo.animate(
      [
        { transform: "none" },
        { transform: `translate(${dx}px, ${dy}px) scale(${to.width / from.width})` },
      ],
      {
        delay: HOLD_MS,
        duration: TRAVEL_MS,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "both",
      },
    );
    return () => animation.cancel();
  }, []);

  return (
    <div
      aria-hidden
      className="text-chrome-fg animate-splash pointer-events-none fixed inset-0 z-40 grid place-items-center"
    >
      <div ref={logoRef} className="animate-splash-logo">
        <Logo className="h-14 md:h-[5.9375rem]" />
      </div>
    </div>
  );
}
