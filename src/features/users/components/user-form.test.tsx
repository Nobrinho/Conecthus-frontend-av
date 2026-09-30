import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/utils";

import { UserForm } from "./user-form";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const createUserAction = vi.fn();
const updateUserAction = vi.fn();
vi.mock("../actions", () => ({
  createUserAction: (...args: unknown[]) => createUserAction(...args),
  updateUserAction: (...args: unknown[]) => updateUserAction(...args),
}));

const user = {
  id: "u1",
  name: "Adriano Machado Souza",
  email: "adriano@exemplo.com",
  registration: "809987",
  createdAt: "2024-05-08T12:00:00.000Z",
  updatedAt: null,
};

async function fillValid() {
  const ue = userEvent.setup();
  await ue.type(screen.getByLabelText("Nome Completo"), "Adriano Souza");
  await ue.type(screen.getByLabelText("Matrícula"), "809987");
  await ue.type(screen.getByLabelText("E-mail"), "adriano@exemplo.com");
  await ue.type(screen.getByLabelText(/^Senha/), "abc123");
  await ue.type(screen.getByLabelText(/^Repetir Senha/), "abc123");
  return ue;
}

describe("UserForm", () => {
  beforeEach(() => {
    push.mockReset();
    createUserAction.mockReset();
    updateUserAction.mockReset();
  });

  it("só habilita Cadastrar quando todos os campos são válidos", async () => {
    renderWithProviders(<UserForm mode="create" />);
    const submit = screen.getByRole("button", { name: "Cadastrar" });
    expect(submit).toBeDisabled();

    const ue = await fillValid();
    await waitFor(() => expect(submit).toBeEnabled());

    await ue.clear(screen.getByLabelText(/^Repetir Senha/));
    await ue.type(screen.getByLabelText(/^Repetir Senha/), "abc124");
    await waitFor(() => expect(submit).toBeDisabled());
    expect(await screen.findByText("As senhas não conferem")).toBeInTheDocument();
  });

  it("descarta caracteres inválidos no nome e na matrícula", async () => {
    renderWithProviders(<UserForm mode="create" />);
    const ue = userEvent.setup();

    await ue.type(screen.getByLabelText("Nome Completo"), "Ana 42 Souza!");
    await ue.type(screen.getByLabelText("Matrícula"), "12ab34");

    expect(screen.getByLabelText("Nome Completo")).toHaveValue("Ana Souza");
    expect(screen.getByLabelText("Matrícula")).toHaveValue("1234");
  });

  it("marca o campo duplicado quando a API responde 409", async () => {
    createUserAction.mockResolvedValue({
      ok: false,
      error: "Já existe um usuário com esta matrícula",
      fieldErrors: { registration: ["Já existe um usuário com esta matrícula"] },
    });
    renderWithProviders(<UserForm mode="create" />);
    const ue = await fillValid();

    await ue.click(screen.getByRole("button", { name: "Cadastrar" }));

    expect(await screen.findAllByText("Já existe um usuário com esta matrícula")).not.toHaveLength(
      0,
    );
    expect(screen.getByLabelText("Matrícula")).toHaveAttribute("aria-invalid", "true");
    expect(push).not.toHaveBeenCalled();
  });

  it("volta para a lista com toast depois de cadastrar", async () => {
    createUserAction.mockResolvedValue({ ok: true, data: user });
    renderWithProviders(<UserForm mode="create" />);
    const ue = await fillValid();

    await ue.click(screen.getByRole("button", { name: "Cadastrar" }));

    expect(await screen.findByText("Cadastro Realizado!")).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/usuarios");
  });

  it("na edição, Salvar só habilita depois de alguma alteração", async () => {
    renderWithProviders(<UserForm mode="edit" user={user} />);
    const save = screen.getByRole("button", { name: "Salvar" });
    expect(screen.getByLabelText("Nome Completo")).toHaveValue(user.name);
    expect(save).toBeDisabled();

    await userEvent.setup().type(screen.getByLabelText("Nome Completo"), " Filho");
    await waitFor(() => expect(save).toBeEnabled());
  });

  it("pede confirmação ao cancelar com dados preenchidos", async () => {
    renderWithProviders(<UserForm mode="create" />);
    const ue = userEvent.setup();
    await ue.type(screen.getByLabelText("Nome Completo"), "Ana");

    await ue.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(await screen.findByText("Deseja cancelar?")).toBeInTheDocument();
    await ue.click(screen.getByRole("button", { name: "Sim" }));
    expect(push).toHaveBeenCalledWith("/usuarios");
    expect(await screen.findByText("Cadastro cancelado")).toBeInTheDocument();
  });
});
