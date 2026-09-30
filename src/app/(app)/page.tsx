import type { Metadata } from "next";

import { IdeaIllustration } from "@/components/brand/illustrations";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/features/auth/server";

export const metadata: Metadata = { title: "Home" };

/** "22, Novembro 2024", como no card de boas-vindas do protótipo. */
function formatToday(date: Date): string {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const month = get("month");
  return `${get("day")}, ${month.charAt(0).toUpperCase()}${month.slice(1)} ${get("year")}`;
}

/** Tela 11 — Home. */
export default async function HomePage() {
  const user = await getCurrentUser();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-3xl font-bold md:text-4xl">Home</h1>
      <section className="bg-surface shadow-card flex flex-1 flex-col rounded-xs p-5 md:p-6">
        <p className="text-2xl font-bold">Olá {firstName}!</p>
        <p className="text-xs font-medium">{formatToday(new Date())}</p>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
          <IdeaIllustration className="w-full max-w-[22rem]" />
          <p className="border-fg/40 w-full max-w-[24rem] rounded-sm border px-6 py-3 text-center text-lg font-bold">
            Bem-vindo ao {siteConfig.name}!
          </p>
        </div>
      </section>
    </div>
  );
}
