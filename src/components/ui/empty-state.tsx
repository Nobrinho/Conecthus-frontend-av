export interface EmptyStateProps {
  title: string;
  description: React.ReactNode;
  illustration?: React.ReactNode;
}

export function EmptyState({ title, description, illustration }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      {illustration}
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="max-w-[30rem] text-lg font-medium">{description}</div>
    </div>
  );
}
