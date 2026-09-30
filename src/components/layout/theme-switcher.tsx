"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { type Theme, themeLabels, themes } from "@/config/theme";
import { applyTheme } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const icons = { system: Monitor, light: Sun, dark: Moon } satisfies Record<Theme, unknown>;

/**
 * Troca o tema na hora (atributo `data-theme` no `<html>`) e guarda a escolha
 * em cookie, que o layout raiz lê no servidor para renderizar já no tema certo.
 */
export function ThemeSwitcher({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  function choose(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  return (
    <fieldset>
      <legend className="text-fg-muted mb-2 text-xs font-bold">Tema</legend>
      <div className="bg-surface-muted grid grid-cols-3 gap-1 rounded-sm p-1">
        {themes.map((option) => {
          const Icon = icons[option];
          const selected = option === theme;
          return (
            <label
              key={option}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-1 rounded-xs px-2 py-1.5 text-xs font-medium",
                "has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-2",
                selected ? "bg-surface text-fg shadow-card" : "text-fg-muted hover:text-fg",
              )}
            >
              <input
                type="radio"
                name="theme"
                value={option}
                checked={selected}
                onChange={() => choose(option)}
                className="sr-only"
              />
              <Icon aria-hidden className="size-4" />
              {themeLabels[option]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
