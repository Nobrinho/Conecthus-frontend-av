import type { Metadata } from "next";

import { HomeIllustration } from "@/components/brand/illustrations";
import { LocalDate } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/features/auth/server";

export const metadata: Metadata = { title: "Home" };

/** Tela 11 — Home. */
export default async function HomePage() {
  const user = await getCurrentUser();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex flex-1 flex-col gap-3">
      <h1 className="md:text-title text-3xl font-bold">Home</h1>
      <section className="bg-surface shadow-card flex flex-1 flex-col rounded-[0.3125rem] p-5 md:px-[1.8125rem] md:pt-6">
        <p className="text-logo-ink md:text-hello text-2xl font-bold">Olá {firstName}!</p>
        {/* Data de hoje no fuso de quem acessa (o servidor pode estar em outro). */}
        <LocalDate
          date={new Date().toISOString()}
          className="text-logo-ink text-base font-semibold md:text-lg"
        />
        <div className="flex flex-1 flex-col items-center gap-4 py-8 md:pt-[4.25rem]">
          <HomeIllustration className="w-full max-w-[33.875rem]" />
          <p className="border-outline-strong md:text-welcome shadow-card w-full max-w-[38.0625rem] rounded-[0.5625rem] border px-6 py-5 text-center text-xl font-bold">
            Bem-vindo ao {siteConfig.name}!
          </p>
        </div>
      </section>
    </div>
  );
}
