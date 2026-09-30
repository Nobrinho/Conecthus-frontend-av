import { describe, expect, it } from "vitest";

import { formatDate, formatRegistration } from "./format";
import { sanitizeName, sanitizeRegistration } from "./rules";

describe("sanitizeName", () => {
  it.each([
    ["Adriano 123", "Adriano "],
    ["Ana!@# Souza", "Ana Souza"],
    ["  Ana", "Ana"],
    ["Ana   Souza", "Ana Souza"],
    ["João Araújo", "João Araújo"],
    ["A".repeat(40), "A".repeat(30)],
  ])("%j → %j", (input, expected) => expect(sanitizeName(input)).toBe(expected));
});

describe("sanitizeRegistration", () => {
  it.each([
    ["80a9-87", "80987"],
    ["12345678901234", "1234567890"],
  ])("%j → %j", (input, expected) => expect(sanitizeRegistration(input)).toBe(expected));
});

describe("format", () => {
  it("agrupa a matrícula como no protótipo", () => {
    expect(formatRegistration("809987")).toBe("809.987");
    expect(formatRegistration("1234")).toBe("1.234");
    expect(formatRegistration("123")).toBe("123");
  });

  it("formata datas no fuso de Brasília", () => {
    expect(formatDate("2024-05-08T12:00:00.000Z")).toBe("08/05/2024");
    expect(formatDate("2024-05-09T01:00:00.000Z")).toBe("08/05/2024");
  });
});
