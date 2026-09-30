import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="text-fg flex flex-wrap items-center gap-1 text-[0.625rem] font-medium">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            {index > 0 && <ChevronRight aria-hidden className="size-3" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
