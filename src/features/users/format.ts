const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

/** "2024-05-08T..." → "08/05/2024". */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** "809987" → "809.987", como na tela de visualização do protótipo. */
export function formatRegistration(registration: string): string {
  return registration.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
