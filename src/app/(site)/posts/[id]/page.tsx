import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { routes } from "@/config/routes";
import { postsApi } from "@/features/posts";
import { ApiError } from "@/lib/api";

async function getPost(rawId: string) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  try {
    return await postsApi.getById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata(props: PageProps<"/posts/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const post = await getPost(id);
  return { title: post.title };
}

/** Exemplo de busca no servidor (Server Component). */
export default async function PostPage(props: PageProps<"/posts/[id]">) {
  const { id } = await props.params;
  const post = await getPost(id);

  return (
    <article className="space-y-4">
      <Link href={routes.posts} className="text-muted-foreground text-sm hover:underline">
        ← Voltar
      </Link>
      <h1 className="text-2xl font-bold capitalize">{post.title}</h1>
      <p className="leading-relaxed">{post.body}</p>
    </article>
  );
}
