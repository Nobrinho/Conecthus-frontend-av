import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";

import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { parseTheme, THEME_COOKIE } from "@/config/theme";
import { AppProviders } from "@/providers";

import { manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#0d1931",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // O tema escolhido vem do cookie, então o HTML já sai do servidor com o
  // `data-theme` certo e não há flash de tema errado na carga.
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html lang="pt-BR" data-theme={theme} className={manrope.variable}>
      <body className="min-h-dvh font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
