"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { EyeIcon, PencilIcon, TrashIcon } from "@/components/icons";
import { ConfirmDialog, useToast } from "@/components/ui";
import { routes } from "@/config/routes";

import { deleteUserAction } from "../actions";
import type { User } from "../types";
import { UserDetailsDrawer } from "./user-details-drawer";

/* Botões de ação do XD: quadrado branco 36×36 com sombra; no hover, fundo da marca e ícone branco. */
const actionClass =
  "bg-surface text-fg shadow-card hover:bg-brand hover:text-brand-fg grid size-10 place-items-center rounded-sm transition-colors md:size-9";

function RowActions({
  user,
  onView,
  onDelete,
}: {
  user: User;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onView}
        aria-label={`Visualizar ${user.name}`}
        className={actionClass}
      >
        <EyeIcon className="size-5" />
      </button>
      <Link
        href={routes.editUser(user.id)}
        aria-label={`Editar ${user.name}`}
        className={actionClass}
      >
        <PencilIcon className="size-5" />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Excluir ${user.name}`}
        className={actionClass}
      >
        <TrashIcon className="size-5" />
      </button>
    </div>
  );
}

/**
 * Lista das telas 13 e 20: tabela no desktop, cartões no celular, com as ações
 * visualizar, editar e excluir (com confirmação).
 */
export function UsersList({ users }: { users: User[] }) {
  const toast = useToast();
  const [viewing, setViewing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    if (!deleting) return;
    const target = deleting;
    startTransition(async () => {
      const result = await deleteUserAction(target.id);
      setDeleting(null);
      if (result.ok) toast.success("Exclusão Realizada!");
      else toast.error(result.error);
    });
  }

  return (
    <>
      {/* Desktop e tablet */}
      <table className="hidden w-full border-separate border-spacing-y-2 text-base font-medium md:table">
        <caption className="sr-only">Usuários cadastrados</caption>
        <thead>
          <tr className="bg-chrome text-chrome-fg text-left">
            <th scope="col" className="h-12 rounded-l-md px-4 font-medium">
              Nome
            </th>
            <th scope="col" className="h-12 w-[10.25rem] rounded-r-md px-3 font-medium">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-surface shadow-card">
              <td className="h-14 rounded-l-[0.3125rem] px-2">{user.name}</td>
              <td className="h-14 rounded-r-[0.3125rem] px-3">
                <RowActions
                  user={user}
                  onView={() => setViewing(user)}
                  onDelete={() => setDeleting(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Celular */}
      <ul className="flex flex-col gap-2 md:hidden" aria-label="Usuários cadastrados">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-surface shadow-card flex items-center justify-between gap-2 rounded-[0.3125rem] py-2 pr-2 pl-4"
          >
            <span className="min-w-0 truncate text-base font-medium">{user.name}</span>
            <RowActions
              user={user}
              onView={() => setViewing(user)}
              onDelete={() => setDeleting(user)}
            />
          </li>
        ))}
      </ul>

      <UserDetailsDrawer user={viewing} onClose={() => setViewing(null)} />
      <ConfirmDialog
        open={deleting !== null}
        title="Deseja excluir?"
        description="O usuário será excluído."
        pending={pending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
