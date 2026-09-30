import { ChartPie, IdCard, type LucideIcon, UserRound } from "lucide-react";

import { routes } from "@/config/routes";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  children: NavLink[];
}

export type NavItem = NavLink | NavGroup;

/** Menu lateral do protótipo. */
export const navItems: NavItem[] = [
  { label: "Home", href: routes.home, icon: ChartPie },
  {
    label: "Controle de Acesso",
    icon: IdCard,
    children: [{ label: "Usuários", href: routes.users, icon: UserRound }],
  },
];

export const isGroup = (item: NavItem): item is NavGroup => "children" in item;

export function isActive(pathname: string, href: string): boolean {
  return href === routes.home ? pathname === href : pathname.startsWith(href);
}
