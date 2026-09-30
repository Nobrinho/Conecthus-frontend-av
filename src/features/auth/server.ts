// Entrada só de servidor da feature (usa cookies e a API). Separada do
// `index.ts` para não arrastar código de servidor para Client Components.
export { getCurrentUser } from "./session";
