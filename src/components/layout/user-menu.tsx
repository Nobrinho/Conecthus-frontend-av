"use client";

import { useEffect, useId, useRef, useState } from "react";

import { ChevronDownSmallIcon, LogoutIcon } from "@/components/icons";
import { Avatar } from "@/components/ui";
import type { Theme } from "@/config/theme";
import { cn } from "@/lib/utils";

import { ThemeSwitcher } from "./theme-switcher";

export interface UserMenuProps {
  user: { name: string; email: string };
  theme: Theme;
  logoutAction: () => Promise<void>;
}

/** Tempo para o balão fechar depois que o mouse sai (dá tempo de chegar nele). */
const CLOSE_DELAY_MS = 200;

/**
 * Avatar do header com o menu do protótipo: abre ao passar o mouse (e também
 * no clique, toque ou teclado), em formato de balão com a seta apontando para
 * o avatar. Mostra o usuário, o seletor de tema e "Sair".
 */
export function UserMenu({ user, theme, logoutAction }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Só o mouse abre por hover; no toque o clique já cuida disso.
  function onPointerEnter(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function onPointerLeave(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <button
        type="button"
        onClick={(event) => {
          // Com mouse o hover já abriu: o clique não deve fechar o balão.
          const { nativeEvent } = event;
          const byMouse =
            nativeEvent instanceof PointerEvent && nativeEvent.pointerType === "mouse";
          setOpen((value) => (byMouse ? true : !value));
        }}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Menu de ${user.name}`}
        className="relative block rounded-full"
      >
        <Avatar
          name={user.name}
          className={cn(
            "ring-[0.1875rem] transition-shadow",
            open ? "ring-chrome-hover" : "ring-accent",
          )}
        />
        {/* Selo com a seta, no canto inferior direito do avatar. */}
        <span
          aria-hidden
          className="bg-surface text-fg shadow-card absolute -right-1 bottom-0.5 grid size-[1.0625rem] place-items-center rounded-full"
        >
          <ChevronDownSmallIcon className={cn("w-2 transition-transform", open && "rotate-180")} />
        </span>
      </button>

      {open && (
        <div id={menuId} className="animate-balloon-in absolute top-full right-0 z-30 pt-3">
          <div className="bg-surface text-fg shadow-overlay border-border relative flex w-[18.375rem] flex-col gap-3 rounded-md border px-2 pt-4 pb-2">
            {/* Seta do balão, alinhada ao centro do avatar. */}
            <span
              aria-hidden
              className="bg-surface border-border absolute -top-[0.4375rem] right-[1.1875rem] size-3 rotate-45 border-t border-l"
            />
            <div className="flex min-w-0 items-center gap-2 px-1">
              <Avatar name={user.name} className="text-sm" />
              <div className="min-w-0">
                <p className="text-brand truncate text-base font-bold">{user.name}</p>
                <p className="truncate text-sm">{user.email}</p>
              </div>
            </div>
            <div className="px-1">
              <ThemeSwitcher initialTheme={theme} />
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-fg hover:bg-brand-soft flex h-[2.4375rem] w-full items-center gap-2 rounded-sm px-3 text-base font-medium transition-colors"
              >
                <LogoutIcon className="h-[1.1875rem] w-auto" />
                Sair
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
