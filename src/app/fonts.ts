import localFont from "next/font/local";

/**
 * Manrope, a fonte do protótipo. Arquivo variável (200–800) versionado no
 * projeto: o build não depende de acesso ao Google Fonts.
 */
export const manrope = localFont({
  src: "../assets/fonts/manrope-latin-variable.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-manrope",
});
