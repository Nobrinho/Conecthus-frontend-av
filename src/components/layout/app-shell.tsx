"use client";

import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/logo";
import type { Theme } from "@/config/theme";
import { saveSidebarCollapsed } from "@/lib/preferences";
import { cn } from "@/lib/utils";

import { Sidebar } from "./sidebar";
import { UserMenu, type UserMenuProps } from "./user-menu";

export interface AppShellProps {
  user: UserMenuProps["user"];
  theme: Theme;
  sidebarCollapsed: boolean;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}

/**
 * Estrutura das telas logadas: sidebar + header + conteúdo.
 *
 * - md ou maior: sidebar fixa, recolhível (estado salvo em cookie para o
 *   servidor já renderizar no formato certo).
 * - celular: sidebar vira gaveta aberta pelo botão de menu do header.
 */
export function AppShell({ user, theme, sidebarCollapsed, logoutAction, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(sidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;
    if (mobileOpen && !dialog.open) dialog.showModal();
    if (!mobileOpen && dialog.open) dialog.close();
  }, [mobileOpen]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    saveSidebarCollapsed(next);
  }

  return (
    <div className="flex min-h-dvh">
      <a
        href="#conteudo"
        className="bg-brand text-brand-fg sr-only z-50 rounded-xs px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>

      <aside
        className={cn(
          "sticky top-0 z-30 hidden h-dvh shrink-0 transition-[width] duration-200 md:block",
          collapsed ? "w-[4.5rem]" : "w-[15rem] xl:w-[16.5rem]",
        )}
      >
        <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </aside>

      <dialog
        ref={drawerRef}
        aria-label="Menu"
        onClose={() => setMobileOpen(false)}
        onClick={(event) => event.target === event.currentTarget && setMobileOpen(false)}
        className="backdrop:bg-overlay m-0 h-dvh max-h-dvh w-[17rem] max-w-[85vw] p-0 md:hidden"
      >
        {mobileOpen && <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />}
      </dialog>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-surface shadow-card sticky top-0 z-20 flex h-16 items-center justify-between gap-4 px-4 md:h-20 md:justify-end md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
              className="text-fg hover:bg-surface-muted grid size-10 place-items-center rounded-full"
            >
              <Menu className="size-6" />
            </button>
            <Logo className="text-2xl" />
          </div>
          <UserMenu user={user} theme={theme} logoutAction={logoutAction} />
        </header>

        <main id="conteudo" className="flex flex-1 flex-col px-4 py-5 md:px-8 md:py-6">
          <div className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}
