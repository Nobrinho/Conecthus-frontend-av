import Link from "next/link";

import { SearchEmptyIllustration } from "@/components/brand/illustrations";
import { PlusIcon } from "@/components/icons";
import { buttonVariants, EmptyState, Pagination } from "@/components/ui";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

import { USERS_PAGE_SIZES } from "../rules";
import type { PaginatedUsers } from "../types";
import { UsersList } from "./users-list";
import { UsersSearch } from "./users-search";

export interface UsersPageProps {
  result: PaginatedUsers;
  search: string;
}

function hrefFor(page: number, search: string, limit: number) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (limit !== USERS_PAGE_SIZES[0]) params.set("limit", String(limit));
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
      <h1 className="md:text-title text-3xl font-bold">Usuários</h1>

      <div className="-mt-1 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <UsersSearch initialValue={search} />
        <Link
          href={routes.newUser}
          className={cn(buttonVariants({ size: "md" }), "md:min-w-[13.9375rem]")}
        >
          <PlusIcon className="size-[1.375rem] shrink-0" />
          Cadastrar Usuário
        </Link>
      </div>

      <div className="flex-1">
        {isEmpty ? (
          <div className="flex h-full flex-col gap-3.5">
            {/* Na busca sem resultado o XD mantém o cabeçalho da tabela. */}
            {search && (
              <div
                aria-hidden
                className="bg-chrome text-chrome-fg hidden h-12 items-center justify-between rounded-md pr-[5.5rem] pl-4 text-base font-medium md:flex"
              >
                <span>Nome</span>
                <span>Ações</span>
              </div>
            )}
            <div className="bg-surface shadow-card grid min-h-[20rem] flex-1 place-items-center rounded-[0.3125rem]">
              {search ? (
                <EmptyState
                  illustration={<SearchEmptyIllustration className="mb-4 w-40 md:w-[14.1875rem]" />}
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
        pageSizeOptions={USERS_PAGE_SIZES}
        hrefFor={(page) => hrefFor(page, search, meta.limit)}
      />
    </div>
  );
}
