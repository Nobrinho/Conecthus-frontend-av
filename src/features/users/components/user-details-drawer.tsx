"use client";

import { Button, Drawer, SectionTitle } from "@/components/ui";

import { formatDate, formatRegistration } from "../format";
import type { User } from "../types";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <dt className="text-sm">{label}</dt>
      <dd className="text-sm font-bold break-words">{children}</dd>
    </div>
  );
}

/** Tela 22: "Visualizar Usuário" em painel lateral. */
export function UserDetailsDrawer({ user, onClose }: { user: User | null; onClose: () => void }) {
  return (
    <Drawer
      open={user !== null}
      onClose={onClose}
      title="Visualizar Usuário"
      footer={
        <Button variant="outline" className="min-w-24" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      {user && (
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4">
            <SectionTitle>Dados do Usuário</SectionTitle>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-5">
              <Detail label="Nome">{user.name}</Detail>
              <Detail label="Matrícula">{formatRegistration(user.registration)}</Detail>
              <div className="col-span-2">
                <Detail label="E-mail">{user.email}</Detail>
              </div>
            </dl>
          </section>
          <section className="flex flex-col gap-4">
            <SectionTitle>Detalhes</SectionTitle>
            <dl className="grid grid-cols-2 gap-x-6">
              <Detail label="Data de criação">{formatDate(user.createdAt)}</Detail>
              <Detail label="Última edição">
                {user.updatedAt ? formatDate(user.updatedAt) : "Nenhuma"}
              </Detail>
            </dl>
          </section>
        </div>
      )}
    </Drawer>
  );
}
