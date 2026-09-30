"use client";

import Link from "next/link";
import { useId, useState, useTransition } from "react";

import { EyeIcon, PencilIcon, TrashIcon } from "@/components/icons";
import { ConfirmDialog, useToast } from "@/components/ui";
import { routes } from "@/config/routes";

import { deleteUserAction } from "../actions";
import type { User } from "../types";
import { UserDetailsDrawer } from "./user-details-drawer";

/* Botões de ação do XD: quadrado branco 36×36 com sombra; no hover, fundo da marca e ícone branco. */
const actionClass =
  "bg-surface text-fg shadow-card hover:bg-brand hover:text-brand-fg grid size-10 place-items-center rounded-sm transition-colors md:size-9";

const SELF_DELETE_HINT = "Você não pode excluir seu próprio usuário";

/**
 * "Excluir" da linha do usuário logado: fica visível, mas desabilitado, com a
 * dica no hover e no foco. Usa `aria-disabled` (e não `disabled`) para o botão
 * continuar focável e a dica chegar também a quem navega por teclado.
 */
function SelfDeleteButton({ user }: { user: User }) {
  const hintId = useId();
  return (
    <span className="group relative">
      <button
        type="button"
        aria-disabled="true"
        aria-label={`Excluir ${user.name}`}
        aria-describedby={hintId}
        className="bg-surface text-fg-muted shadow-card grid size-10 cursor-not-allowed place-items-center rounded-sm opacity-50 md:size-9"
      >
        <TrashIcon className="size-5" />
      </button>
      <span
        id={hintId}
        role="tooltip"
        className="bg-chrome text-chrome-fg shadow-raised pointer-events-none absolute right-0 bottom-full z-10 mb-2 hidden w-max max-w-[16rem] rounded-sm px-3 py-2 text-xs font-medium group-focus-within:block group-hover:block"
      >
        {SELF_DELETE_HINT}
      </span>
    </span>
  );
}

function RowActions({
  user,
  isSelf,
  onView,
  onDelete,
}: {
  user: User;
  isSelf: boolean;
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
      {isSelf ? (
        <SelfDeleteButton user={user} />
      ) : (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Excluir ${user.name}`}
          className={actionClass}
        >
          <TrashIcon className="size-5" />
        </button>
      )}
    </div>
  );
}

/**
 * Lista das telas 13 e 20: tabela no desktop, cartões no celular, com as ações
 * visualizar, editar e excluir (com confirmação).
 */
export function UsersList({ users, currentUserId }: { users: User[]; currentUserId: string }) {
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
                  isSelf={user.id === currentUserId}
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
              isSelf={user.id === currentUserId}
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
