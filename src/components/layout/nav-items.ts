import { AccessControlIcon, HomeIcon, type IconProps, UserIcon } from "@/components/icons";
import { routes } from "@/config/routes";

type Icon = (props: IconProps) => React.ReactNode;

export interface NavLink {
  label: string;
  href: string;
  icon: Icon;
}

export interface NavGroup {
  label: string;
  icon: Icon;
  children: NavLink[];
}

export type NavItem = NavLink | NavGroup;

/** Menu lateral do protótipo. */
export const navItems: NavItem[] = [
  { label: "Home", href: routes.home, icon: HomeIcon },
  {
    label: "Controle de Acesso",
    icon: AccessControlIcon,
    children: [{ label: "Usuários", href: routes.users, icon: UserIcon }],
  },
];

export const isGroup = (item: NavItem): item is NavGroup => "children" in item;

export function isActive(pathname: string, href: string): boolean {
  return href === routes.home ? pathname === href : pathname.startsWith(href);
}
