"use client";

import { useState } from "react";

import { Button, Drawer, SectionTitle } from "@/components/ui";

import { formatDate, formatRegistration } from "../format";
import type { User } from "../types";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <dt className="text-lg font-medium">{label}</dt>
      <dd className="text-lg font-bold break-words">{children}</dd>
    </div>
  );
}

/** Tela 22: "Visualizar Usuário" em painel lateral. */
export function UserDetailsDrawer({ user, onClose }: { user: User | null; onClose: () => void }) {
  // Mantém o último usuário enquanto o painel desliza para fora.
  const [shown, setShown] = useState(user);
  if (user && user !== shown) setShown(user);

  return (
    <Drawer
      open={user !== null}
      onClose={onClose}
      title="Visualizar Usuário"
      footer={
        <Button variant="outline" className="h-[3.625rem] min-w-[9.5rem]" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      {shown && (
        <div className="flex flex-col gap-7">
          <section className="flex flex-col gap-5">
            <SectionTitle>Dados do Usuário</SectionTitle>
            <dl className="grid grid-cols-[minmax(0,15rem)_1fr] gap-x-4 gap-y-6">
              <Detail label="Nome">{shown.name}</Detail>
              <Detail label="Matrícula">{formatRegistration(shown.registration)}</Detail>
              <div className="col-span-2">
                <Detail label="E-mail">{shown.email}</Detail>
              </div>
            </dl>
          </section>
          <section className="flex flex-col gap-5">
            <SectionTitle>Detalhes</SectionTitle>
            <dl className="grid grid-cols-[minmax(0,10.1875rem)_1fr] gap-x-4">
              <Detail label="Data de criação">{formatDate(shown.createdAt)}</Detail>
              <Detail label="Última edição">
                {shown.updatedAt ? formatDate(shown.updatedAt) : "Nenhuma"}
              </Detail>
            </dl>
          </section>
        </div>
      )}
    </Drawer>
  );
}
