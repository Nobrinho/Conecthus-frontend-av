import type { Metadata } from "next";

import { UsersPage } from "@/features/users";
import { usersApi } from "@/features/users/server";

export const metadata: Metadata = { title: "Usuários" };

export default async function UsersRoute({ searchParams }: PageProps<"/usuarios">) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.trim().slice(0, 30) : "";
  const page = Math.max(1, Number.parseInt(String(params.page ?? "1"), 10) || 1);

  const result = await usersApi.list({ page, search });

  return <UsersPage result={result} search={search} />;
}
