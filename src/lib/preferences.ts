import { SIDEBAR_COOKIE, type Theme, THEME_COOKIE } from "@/config/theme";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Preferências de interface guardadas em cookie (e não em localStorage) para
 * que o servidor já renderize o HTML com o tema e a sidebar certos.
 */
function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  writeCookie(THEME_COOKIE, theme);
}

export function saveSidebarCollapsed(collapsed: boolean) {
  writeCookie(SIDEBAR_COOKIE, collapsed ? "collapsed" : "expanded");
}
