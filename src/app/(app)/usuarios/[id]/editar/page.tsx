import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApiError } from "@/lib/api";
import { UserForm } from "@/features/users";
import { usersApi } from "@/features/users/server";

export const metadata: Metadata = { title: "Editar Usuário" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditUserPage({ params }: PageProps<"/usuarios/[id]/editar">) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const user = await usersApi.get(id).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  return <UserForm key={user.id} mode="edit" user={user} />;
}
