"use client";

import { LogOut } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { Avatar } from "@/components/ui";
import type { Theme } from "@/config/theme";

import { ThemeSwitcher } from "./theme-switcher";

export interface UserMenuProps {
  user: { name: string; email: string };
  theme: Theme;
  logoutAction: () => Promise<void>;
}

/** Avatar com iniciais no header; abre um menu com dados, tema e sair. */
export function UserMenu({ user, theme, logoutAction }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Menu de ${user.name}`}
        className="rounded-full"
      >
        <Avatar name={user.name} />
      </button>

      {open && (
        <div
          id={menuId}
          className="bg-surface text-fg shadow-overlay absolute top-12 right-0 z-30 flex w-64 flex-col gap-4 rounded-sm p-4"
        >
          <div className="min-w-0">
            <p className="truncate font-bold">{user.name}</p>
            <p className="text-fg-muted truncate text-xs">{user.email}</p>
          </div>
          <ThemeSwitcher initialTheme={theme} />
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-fg hover:bg-surface-muted flex h-10 w-full items-center gap-2 rounded-xs px-2 text-sm font-bold"
            >
              <LogOut aria-hidden className="size-4" />
              Sair
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
