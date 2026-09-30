"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";
import { CaretDownIcon, ChevronLeftIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { isActive, isGroup, type NavGroup, type NavLink, navItems } from "./nav-items";

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  /** Recolhida, o clique num grupo (ex.: "Controle de Acesso") expande o menu. */
  onExpand?: () => void;
  /** Chamado ao navegar (fecha o menu no celular). */
  onNavigate?: () => void;
}

/*
 * Estados dos itens (componente do XD): padrão com texto branco, hover com
 * fundo `chrome-hover` e selecionado com fundo `chrome-selected` e texto escuro.
 */
const itemState = (active: boolean) =>
  active
    ? "bg-chrome-selected text-chrome-selected-fg font-extrabold"
    : "text-chrome-fg/90 hover:bg-chrome-hover hover:text-chrome-fg";

/** Recolhida: quadrado 60×54 só com o ícone, centralizado no trilho. */
const collapsedItem = "mx-auto h-[3.375rem] w-[3.75rem] justify-center rounded-md px-0";

function Item({
  link,
  collapsed,
  nested,
  onNavigate,
}: {
  link: NavLink;
  collapsed: boolean;
  nested?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, link.href);
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? link.label : undefined}
      className={cn(
        "flex items-center gap-2.5 text-base font-medium transition-colors",
        nested ? "ml-10 h-[2.3125rem] rounded-sm px-3.5" : "h-[3.375rem] rounded-md px-[1.125rem]",
        itemState(active),
        collapsed && collapsedItem,
      )}
    >
      <Icon className={cn("shrink-0", nested ? "size-5" : "size-6")} />
      <span className={cn(collapsed && "sr-only")}>{link.label}</span>
    </Link>
  );
}

function Group({
  group,
  collapsed,
  open,
  onToggle,
  onExpand,
  onNavigate,
}: {
  group: NavGroup;
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
  onExpand?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const Icon = group.icon;

  if (collapsed) {
    // O trilho mostra o grupo como um item; ativo quando uma página dele está aberta.
    const active = group.children.some((child) => isActive(pathname, child.href));
    return (
      <button
        type="button"
        onClick={onExpand}
        title={group.label}
        aria-label={group.label}
        className={cn("flex transition-colors", itemState(active), collapsedItem, "items-center")}
      >
        <Icon className="size-6 shrink-0" />
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex h-[3.375rem] w-full items-center gap-2.5 rounded-md px-[1.125rem] text-base font-bold transition-colors",
          itemState(false),
        )}
      >
        <Icon className="size-6 shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        <CaretDownIcon className={cn("size-2.5 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && (
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {group.children.map((child) => (
            <li key={child.href}>
              <Item link={child} collapsed={false} nested onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Menu lateral escuro (telas 11 em diante), expandido ou recolhido ("WL."). */
export function Sidebar({ collapsed, onToggleCollapsed, onExpand, onNavigate }: SidebarProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  return (
    <div className="bg-chrome text-chrome-fg shadow-raised relative flex h-full flex-col">
      <div
        className={cn(
          "flex h-[7.875rem] shrink-0 items-start pt-[2.6875rem]",
          collapsed ? "justify-center px-2 pt-8" : "px-10",
        )}
      >
        <Logo compact={collapsed} className={collapsed ? "h-12" : "h-[2.275rem]"} />
      </div>

      {onToggleCollapsed && (
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          aria-expanded={!collapsed}
          className={cn(
            "bg-surface-muted text-fg shadow-raised hover:bg-control-hover absolute z-10 grid size-[2.3125rem] place-items-center rounded-full transition-colors",
            "-right-[1.1875rem]",
            collapsed ? "top-8" : "top-[2.8125rem]",
          )}
        >
          <ChevronLeftIcon className={cn("h-4 w-auto", collapsed && "rotate-180")} />
        </button>
      )}

      <nav
        aria-label="Menu principal"
        className={cn("flex-1 overflow-y-auto pb-4", collapsed ? "px-2" : "px-[0.9375rem]")}
      >
        <ul className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <li key={item.label}>
              {isGroup(item) ? (
                <Group
                  group={item}
                  collapsed={collapsed}
                  open={openGroups[item.label] ?? true}
                  onToggle={() =>
                    setOpenGroups((state) => ({
                      ...state,
                      [item.label]: !(state[item.label] ?? true),
                    }))
                  }
                  onExpand={() => {
                    setOpenGroups((state) => ({ ...state, [item.label]: true }));
                    onExpand?.();
                  }}
                  onNavigate={onNavigate}
                />
              ) : (
                <Item link={item} collapsed={collapsed} onNavigate={onNavigate} />
              )}
            </li>
          ))}
        </ul>
      </nav>

      <footer className={cn("shrink-0 pb-7", collapsed ? "px-2 text-center" : "px-10")}>
        {collapsed ? (
          <p className="text-chrome-muted text-xs">V {siteConfig.version}</p>
        ) : (
          <>
            <p className="text-lg font-bold">© {siteConfig.name}</p>
            <p className="text-chrome-muted text-xs">Power by {siteConfig.company}</p>
            <p className="text-chrome-muted text-xs">V {siteConfig.version}</p>
          </>
        )}
      </footer>
    </div>
  );
}
