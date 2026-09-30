"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { SearchInput } from "@/components/ui";
import { useDebounce } from "@/hooks/use-debounce";

/**
 * Busca por nome. O termo vai para a URL (`?search=`) com debounce, então a
 * página do servidor refaz a consulta e a busca fica compartilhável.
 */
export function UsersSearch({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const debounced = useDebounce(value.trim(), 400);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (debounced === current) return;

    const params = new URLSearchParams(searchParams);
    if (debounced) params.set("search", debounced);
    else params.delete("search");
    // Nova busca sempre começa da primeira página.
    params.delete("page");

    const query = params.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname));
  }, [debounced, pathname, router, searchParams]);

  return (
    <SearchInput
      value={value}
      onValueChange={setValue}
      label="Pesquisa"
      maxLength={30}
      className="w-full md:w-[15rem]"
    />
  );
}
