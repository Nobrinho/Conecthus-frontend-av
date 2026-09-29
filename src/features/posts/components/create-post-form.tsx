"use client";

import { Button } from "@/components/ui";

import { useCreatePost } from "../hooks/use-create-post";

const fieldClass =
  "w-full rounded-md border border-border bg-transparent px-3 py-2 focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none";

export function CreatePostForm() {
  const { mutate, data: result, isPending } = useCreatePost();
  const fieldErrors = result && !result.ok ? result.fieldErrors : undefined;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    mutate(
      { title: String(formData.get("title") ?? ""), body: String(formData.get("body") ?? "") },
      { onSuccess: (res) => res.ok && form.reset() },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border space-y-3 rounded-lg border p-4"
      noValidate
    >
      <h2 className="font-semibold">Novo post</h2>

      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Título
        </label>
        <input id="title" name="title" className={fieldClass} aria-invalid={!!fieldErrors?.title} />
        {fieldErrors?.title && <p className="text-sm text-red-600">{fieldErrors.title[0]}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="body" className="text-sm font-medium">
          Conteúdo
        </label>
        <textarea
          id="body"
          name="body"
          rows={3}
          className={fieldClass}
          aria-invalid={!!fieldErrors?.body}
        />
        {fieldErrors?.body && <p className="text-sm text-red-600">{fieldErrors.body[0]}</p>}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Criar post"}
        </Button>
        <p role="status" className="text-muted-foreground text-sm">
          {result?.ok && `Post #${result.data.id} criado.`}
          {result && !result.ok && !fieldErrors && result.error}
        </p>
      </div>
    </form>
  );
}
