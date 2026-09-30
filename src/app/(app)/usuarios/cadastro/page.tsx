import type { Metadata } from "next";

import { UserForm } from "@/features/users";

export const metadata: Metadata = { title: "Cadastro de Usuário" };

export default function NewUserPage() {
  return <UserForm mode="create" />;
}
