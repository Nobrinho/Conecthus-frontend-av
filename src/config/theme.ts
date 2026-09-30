/**
 * Temas disponíveis. `system` segue o sistema operacional; os demais precisam
 * de um bloco `[data-theme="nome"]` em `src/styles/themes` (light e dark já
 * vêm do contrato padrão via `light-dark()`).
 */
export const themes = ["system", "light", "dark"] as const;

export type Theme = (typeof themes)[number];

export const themeLabels: Record<Theme, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Escuro",
};

export const THEME_COOKIE = "wl_theme";
export const SIDEBAR_COOKIE = "wl_sidebar";

export function parseTheme(value: string | undefined): Theme {
  return themes.includes(value as Theme) ? (value as Theme) : "system";
}
