"use client";

import { ChevronDown, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { isActive, isGroup, type NavLink, navItems } from "./nav-items";

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  /** Chamado ao navegar (fecha o menu no celular). */
  onNavigate?: () => void;
}

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
        "flex h-10 items-center gap-3 rounded-xs px-3 text-sm font-medium transition-colors",
        active ? "bg-accent text-accent-fg font-bold" : "text-chrome-fg hover:bg-chrome-fg/10",
        nested && !collapsed && "ml-6",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      <span className={cn(collapsed && "sr-only")}>{link.label}</span>
    </Link>
  );
}

/** Menu lateral escuro (telas 11 em diante). */
export function Sidebar({ collapsed, onToggleCollapsed, onNavigate }: SidebarProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  return (
    <div className="bg-chrome text-chrome-fg relative flex h-full flex-col">
      <div className={cn("flex h-20 items-center px-6", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <span aria-label={siteConfig.name} className="text-accent text-3xl font-bold">
            W
            <span aria-hidden className="text-chrome-fg">
              .
            </span>
          </span>
        ) : (
          <Logo className="text-3xl xl:text-4xl" />
        )}
      </div>

      {onToggleCollapsed && (
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          aria-expanded={!collapsed}
          className="bg-surface text-fg shadow-raised absolute top-7 -right-3 z-10 grid size-6 place-items-center rounded-full"
        >
          <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      )}

      <nav aria-label="Menu principal" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            if (!isGroup(item)) {
              return (
                <li key={item.label}>
                  <Item link={item} collapsed={collapsed} onNavigate={onNavigate} />
                </li>
              );
            }
            const open = collapsed || (openGroups[item.label] ?? true);
            const Icon = item.icon;
            return (
              <li key={item.label}>
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => setOpenGroups((state) => ({ ...state, [item.label]: !open }))}
                    aria-expanded={open}
                    className="text-chrome-fg hover:bg-chrome-fg/10 flex h-10 w-full items-center gap-3 rounded-xs px-3 text-sm font-medium"
                  >
                    <Icon aria-hidden className="size-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      aria-hidden
                      className={cn("size-4 transition-transform", !open && "-rotate-90")}
                    />
                  </button>
                )}
                {open && (
                  <ul className={cn("flex flex-col gap-1", !collapsed && "mt-1")}>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Item link={child} collapsed={collapsed} nested onNavigate={onNavigate} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className={cn("px-6 pb-6 text-xs", collapsed && "px-2 text-center")}>
        {collapsed ? (
          <p className="font-bold">©</p>
        ) : (
          <>
            <p className="text-sm font-bold">© {siteConfig.name}</p>
            <p className="text-chrome-muted text-[0.625rem]">Power by {siteConfig.company}</p>
            <p className="text-chrome-muted text-[0.625rem]">V {siteConfig.version}</p>
          </>
        )}
      </footer>
    </div>
  );
}
