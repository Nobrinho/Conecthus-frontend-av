import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{siteConfig.name}</h1>
      <p className="text-muted-foreground max-w-2xl">{siteConfig.description}</p>
      <Link
        href={routes.posts}
        className="bg-foreground text-background inline-flex h-10 items-center rounded-md px-4 font-medium hover:opacity-90"
      >
        Ver exemplo de feature
      </Link>
    </section>
  );
}
