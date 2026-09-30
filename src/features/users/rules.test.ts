import { describe, expect, it } from "vitest";

import { formatDate, formatRegistration } from "./format";
import { parsePageSize, sanitizeName, sanitizeRegistration } from "./rules";

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

  it("formata datas no fuso de quem vê", () => {
    expect(formatDate("2024-05-08T12:00:00.000Z", "UTC")).toBe("08/05/2024");
    // 03:30 UTC ainda é dia 08 em Manaus (UTC-4), mas já é dia 09 em UTC.
    expect(formatDate("2024-05-09T03:30:00.000Z", "America/Manaus")).toBe("08/05/2024");
    expect(formatDate("2024-05-09T03:30:00.000Z", "UTC")).toBe("09/05/2024");
  });
});

describe("parsePageSize", () => {
  it.each([
    [undefined, 15],
    ["50", 50],
    ["100", 100],
    ["20", 15],
    ["abc", 15],
  ])("%j → %j", (input, expected) => expect(parsePageSize(input)).toBe(expected));
});
