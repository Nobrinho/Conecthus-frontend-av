import { describe, expect, it } from "vitest";

import { createUserSchema, updateUserSchema } from "./types";

const valid = {
  name: "Adriano Machado Souza",
  registration: "809987",
  email: "adriano.machado@callidus.com.br",
  password: "abc123",
  confirmPassword: "abc123",
};

const errorsFor = (input: object) => {
  const result = createUserSchema.safeParse({ ...valid, ...input });
  return result.success ? {} : result.error.flatten().fieldErrors;
};

describe("createUserSchema (regras da avaliação)", () => {
  it("aceita um cadastro válido", () => {
    expect(createUserSchema.safeParse(valid).success).toBe(true);
  });

  it("exige todos os campos", () => {
    const result = createUserSchema.safeParse({
      name: "",
      registration: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    expect(result.success).toBe(false);
    expect(Object.keys(result.error!.flatten().fieldErrors).sort()).toEqual(
      ["confirmPassword", "email", "name", "password", "registration"].sort(),
    );
  });

  it.each(["Adriano 2", "Adriano!", "Ana  Souza", "A".repeat(31)])(
    "recusa o nome %j (apenas letras, até 30)",
    (name) => expect(errorsFor({ name }).name).toBeDefined(),
  );

  it("aceita nomes acentuados", () => {
    expect(errorsFor({ name: "João Araújo" }).name).toBeUndefined();
  });

  it.each(["adriano@", "adriano", "@x.com", `${"a".repeat(35)}@x.com`])(
    "recusa o e-mail %j",
    (email) => expect(errorsFor({ email }).email).toBeDefined(),
  );

  it.each(["80a987", "123", "12345678901", "12.34"])(
    "recusa a matrícula %j (apenas números, 4 a 10)",
    (registration) => expect(errorsFor({ registration }).registration).toBeDefined(),
  );

  it.each(["abc12", "abc1234", "abc12!", "abc 12"])(
    "recusa a senha %j (6 alfanuméricos)",
    (password) => expect(errorsFor({ password, confirmPassword: password }).password).toBeDefined(),
  );

  it("exige que as senhas confiram", () => {
    expect(errorsFor({ confirmPassword: "abc124" }).confirmPassword).toEqual([
      "As senhas não conferem",
    ]);
  });
});

describe("updateUserSchema", () => {
  it("aceita senha em branco (mantém a atual)", () => {
    expect(
      updateUserSchema.safeParse({ ...valid, password: "", confirmPassword: "" }).success,
    ).toBe(true);
  });

  it("valida a senha quando preenchida", () => {
    expect(
      updateUserSchema.safeParse({ ...valid, password: "ab", confirmPassword: "ab" }).success,
    ).toBe(false);
  });
});
