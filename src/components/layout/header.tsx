import Link from "next/link";

import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="border-border border-b">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold">
          {siteConfig.name}
        </Link>
        <nav className="flex gap-4 text-sm">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
