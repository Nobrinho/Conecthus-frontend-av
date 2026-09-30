"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { ConfirmDialog, useToast } from "@/components/ui";
import { routes } from "@/config/routes";

import { deleteUserAction } from "../actions";
import type { User } from "../types";
import { UserDetailsDrawer } from "./user-details-drawer";

const actionClass =
  "text-fg hover:bg-surface-muted grid size-10 place-items-center rounded-full md:size-8";

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
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onView}
        aria-label={`Visualizar ${user.name}`}
        className={actionClass}
      >
        <Eye className="size-5" />
      </button>
      <Link
        href={routes.editUser(user.id)}
        aria-label={`Editar ${user.name}`}
        className={actionClass}
      >
        <Pencil className="size-5" />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Excluir ${user.name}`}
        className={actionClass}
      >
        <Trash2 className="size-5" />
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
      if (result.ok) toast.success("Usuário Excluído!");
      else toast.error(result.error);
    });
  }

  return (
    <>
      {/* Desktop e tablet */}
      <table className="hidden w-full border-separate border-spacing-y-1 text-sm md:table">
        <caption className="sr-only">Usuários cadastrados</caption>
        <thead>
          <tr className="bg-chrome text-chrome-fg text-left">
            <th scope="col" className="rounded-l-xs px-3 py-2.5 font-medium">
              Nome
            </th>
            <th scope="col" className="w-36 rounded-r-xs px-3 py-2.5 font-medium">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-surface shadow-card">
              <td className="rounded-l-xs px-3 py-1.5">{user.name}</td>
              <td className="rounded-r-xs px-3 py-1.5">
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
            className="bg-surface shadow-card flex items-center justify-between gap-2 rounded-xs py-1 pr-1 pl-4"
          >
            <span className="min-w-0 truncate text-sm font-medium">{user.name}</span>
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
