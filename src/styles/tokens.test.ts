import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Guarda-corpo do sistema de temas: componentes só podem usar tokens
 * semânticos. Cor crua em JSX/TS (hex, rgb, hsl) quebraria a troca de tema e
 * a regra "tema novo = só tokens". As exceções legítimas são os arquivos de
 * tokens (CSS) e o `themeColor` da meta tag, que o navegador exige literal.
 */
const SRC = join(__dirname, "..");
const ALLOWED = new Set(["app/layout.tsx"]);
const RAW_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch)\(/i;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|mts)$/.test(entry) && !entry.includes(".test.") ? [path] : [];
  });
}

describe("tokens de tema", () => {
  it("nenhum componente usa cor crua", () => {
    const offenders = sourceFiles(SRC)
      .map((file) => relative(SRC, file).replaceAll("\\", "/"))
      .filter((file) => !ALLOWED.has(file))
      .filter((file) => RAW_COLOR.test(readFileSync(join(SRC, file), "utf8")));

    expect(offenders).toEqual([]);
  });

  it("o tema padrão define todos os tokens que o Tailwind expõe", () => {
    const globals = readFileSync(join(SRC, "app/globals.css"), "utf8");
    const theme = readFileSync(join(SRC, "styles/themes/default.css"), "utf8");
    const exposed = [...globals.matchAll(/--color-[a-z-]+: var\(--([a-z-]+)\)/g)].map((m) => m[1]);

    expect(exposed.length).toBeGreaterThan(10);
    for (const token of exposed) expect(theme, `--${token}`).toContain(`--${token}:`);
  });
});
