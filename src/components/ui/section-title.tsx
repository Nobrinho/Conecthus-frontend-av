/** Título de seção com linha divisória, como "Dados do Usuário ———". */
export function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div className="flex items-center gap-2">
      <h2 id={id} className="text-fg shrink-0 text-sm font-bold">
        {children}
      </h2>
      <span aria-hidden className="bg-border-strong/60 h-px flex-1" />
    </div>
  );
}
