"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { type Path, useForm } from "react-hook-form";

import { BackIcon } from "@/components/icons";
import {
  Breadcrumb,
  Button,
  ConfirmDialog,
  SectionTitle,
  TextField,
  useToast,
} from "@/components/ui";
import { routes } from "@/config/routes";

import { createUserAction, updateUserAction } from "../actions";
import { sanitizeName, sanitizeRegistration, USER_RULES } from "../rules";
import { createUserSchema, updateUserSchema, type User, type UserFormValues } from "../types";

export type UserFormProps = { mode: "create" } | { mode: "edit"; user: User };

const EMPTY: UserFormValues = {
  name: "",
  registration: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const COPY = {
  create: {
    title: "Cadastro de Usuário",
    submit: "Cadastrar",
    success: "Cadastro Realizado!",
    cancelled: "Cadastro cancelado",
  },
  edit: {
    title: "Editar Usuário",
    submit: "Salvar",
    success: "Dados salvos com sucesso!",
    cancelled: "Edição cancelada",
  },
} as const;

/**
 * Formulário das telas 14 (cadastro) e 23 (edição).
 *
 * Valida a cada digitação com as mesmas regras da API e só habilita o botão
 * quando tudo está válido. Na edição, também exige que algo tenha mudado.
 * Nome e matrícula descartam na hora o que não for letra ou número.
 */
export function UserForm(props: UserFormProps) {
  const { mode } = props;
  const copy = COPY[mode];
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const headingId = useId();
  const userSectionId = useId();
  const accessSectionId = useId();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<UserFormValues>({
    resolver: zodResolver(mode === "create" ? createUserSchema : updateUserSchema),
    mode: "onChange",
    defaultValues:
      mode === "edit"
        ? {
            ...EMPTY,
            name: props.user.name,
            registration: props.user.registration,
            email: props.user.email,
          }
        : EMPTY,
  });

  const canSubmit = isValid && (mode === "create" || isDirty) && !pending;

  const nameField = register("name");
  const registrationField = register("registration");

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createUserAction(values)
          : await updateUserAction(props.user.id, values);

      if (!result.ok) {
        for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
          if (messages?.[0]) setError(field as Path<UserFormValues>, { message: messages[0] });
        }
        toast.error(result.error);
        return;
      }

      toast.success(copy.success);
      router.push(routes.users);
    }),
  );

  function requestCancel() {
    if (isDirty) setConfirmingCancel(true);
    else router.push(routes.users);
  }

  function confirmCancel() {
    setConfirmingCancel(false);
    toast.warning(copy.cancelled);
    router.push(routes.users);
  }

  return (
    <div className="flex flex-col md:-mt-2.5">
      <Breadcrumb items={[{ label: "Usuários", href: routes.users }, { label: copy.title }]} />
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={requestCancel}
          aria-label="Voltar para a lista de usuários"
          className="text-fg hover:bg-control-hover -ml-2 grid size-10 place-items-center rounded-full transition-colors"
        >
          <BackIcon className="h-6 w-auto" />
        </button>
        <h1 id={headingId} className="md:text-title text-3xl font-bold">
          {copy.title}
        </h1>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        aria-labelledby={headingId}
        className="bg-surface shadow-card mt-1.5 flex flex-col gap-10 rounded-[0.3125rem] px-4 pt-4 pb-6 md:-ml-[0.4375rem] md:px-[1.1875rem] md:pt-[1.125rem] md:pb-[1.5625rem]"
      >
        <section aria-labelledby={userSectionId} className="flex flex-col gap-5">
          <SectionTitle id={userSectionId}>Dados do Usuário</SectionTitle>
          <div className="grid gap-x-[1.6875rem] gap-y-[2.1875rem] md:grid-cols-2">
            <TextField
              label="Nome Completo"
              placeholderLabel="Insira o nome completo"
              required
              autoComplete="name"
              maxLength={USER_RULES.name.maxLength}
              hint={`• Máx. ${USER_RULES.name.maxLength} Caracteres`}
              error={errors.name?.message}
              {...nameField}
              onChange={(event) => {
                event.target.value = sanitizeName(event.target.value);
                return nameField.onChange(event);
              }}
            />
            <TextField
              label="Matrícula"
              placeholderLabel="Insira o Nº da matrícula"
              required
              inputMode="numeric"
              autoComplete="off"
              maxLength={USER_RULES.registration.maxLength}
              hint={`• Mín. ${USER_RULES.registration.minLength} Números | • Máx. ${USER_RULES.registration.maxLength} Caracteres`}
              error={errors.registration?.message}
              {...registrationField}
              onChange={(event) => {
                event.target.value = sanitizeRegistration(event.target.value);
                return registrationField.onChange(event);
              }}
            />
            <TextField
              label="E-mail"
              placeholderLabel="Insira o E-mail"
              required
              type="email"
              autoComplete="email"
              maxLength={USER_RULES.email.maxLength}
              hint={`• Máx. ${USER_RULES.email.maxLength} Caracteres`}
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
        </section>

        <section aria-labelledby={accessSectionId} className="flex flex-col gap-5">
          <SectionTitle id={accessSectionId}>Dados de acesso</SectionTitle>
          <div className="grid gap-x-[1.6875rem] gap-y-[2.1875rem] md:grid-cols-2">
            <TextField
              label="Senha"
              type="password"
              revealable
              required={mode === "create"}
              autoComplete="new-password"
              maxLength={USER_RULES.password.length}
              hint={
                mode === "edit"
                  ? "• 6 letras ou números. Em branco, mantém a atual"
                  : "• 6 letras ou números"
              }
              error={errors.password?.message}
              {...register("password", { deps: ["confirmPassword"] })}
            />
            <TextField
              label="Repetir Senha"
              type="password"
              revealable
              required={mode === "create"}
              autoComplete="new-password"
              maxLength={USER_RULES.password.length}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>
        </section>

        <div className="mt-2 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <Button variant="outline" onClick={requestCancel} className="md:min-w-[10.875rem]">
            Cancelar
          </Button>
          <Button type="submit" disabled={!canSubmit} className="md:min-w-[10.875rem]">
            {pending ? "Salvando..." : copy.submit}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmingCancel}
        title="Deseja cancelar?"
        description="Os dados inseridos não serão salvos"
        onConfirm={confirmCancel}
        onCancel={() => setConfirmingCancel(false)}
      />
    </div>
  );
}
