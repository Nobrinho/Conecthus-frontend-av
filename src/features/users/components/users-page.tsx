import { Plus } from "lucide-react";
import Link from "next/link";

import { SearchEmptyIllustration } from "@/components/brand/illustrations";
import { buttonVariants, EmptyState, Pagination } from "@/components/ui";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

import type { PaginatedUsers } from "../types";
import { UsersList } from "./users-list";
import { UsersSearch } from "./users-search";

export interface UsersPageProps {
  result: PaginatedUsers;
  search: string;
}

function hrefFor(page: number, search: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${routes.users}?${query}` : routes.users;
}

/** Telas 12, 13 e 19: lista, estado vazio e busca sem resultado. */
export function UsersPage({ result, search }: UsersPageProps) {
  const { data: users, meta } = result;
  const isEmpty = users.length === 0;

  return (
    <div className="flex min-h-full flex-col gap-4">
      <h1 className="text-3xl font-bold md:text-4xl">Usuários</h1>

      <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <UsersSearch initialValue={search} />
        <Link href={routes.newUser} className={cn(buttonVariants({ size: "md" }), "text-sm")}>
          <Plus aria-hidden className="size-5" />
          Cadastrar Usuário
        </Link>
      </div>

      <div className="flex-1">
        {isEmpty ? (
          <div className="bg-surface shadow-card grid h-full min-h-[20rem] place-items-center rounded-xs">
            {search ? (
              <EmptyState
                illustration={<SearchEmptyIllustration className="mb-2 w-28 md:w-36" />}
                title="Nenhum Resultado Encontrado"
                description={
                  <>
                    <p>Não foi possível achar nenhum resultado para sua busca.</p>
                    <p>Tente refazer a pesquisa para encontrar o que busca.</p>
                  </>
                }
              />
            ) : (
              <EmptyState
                title="Nenhum Usuário Registrado"
                description={<p>Clique em “Cadastrar Usuário” para começar a cadastrar.</p>}
              />
            )}
          </div>
        ) : (
          <UsersList users={users} />
        )}
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        total={meta.total}
        pageSize={meta.limit}
        hrefFor={(page) => hrefFor(page, search)}
      />
    </div>
  );
}
