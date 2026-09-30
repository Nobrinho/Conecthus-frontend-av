import { describe, expect, it } from "vitest";

import { ApiError } from "./errors";

describe("ApiError", () => {
  it("expõe o campo e a mensagem do envelope de erro da API", () => {
    const error = new ApiError("x", 409, {
      statusCode: 409,
      message: "Já existe um usuário com este e-mail",
      field: "email",
    });

    expect(error.details?.field).toBe("email");
    expect(error.userMessage).toBe("Já existe um usuário com este e-mail");
  });

  it("usa a primeira mensagem de uma lista de validação", () => {
    const error = new ApiError("x", 400, { statusCode: 400, message: ["a", "b"] });
    expect(error.userMessage).toBe("a");
  });

  it("tolera corpos fora do formato", () => {
    expect(new ApiError("x", 500, "boom").userMessage).toBeUndefined();
  });
});
