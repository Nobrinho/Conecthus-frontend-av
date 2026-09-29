import type { Metadata } from "next";

import { CreatePostForm, PostList } from "@/features/posts";

export const metadata: Metadata = { title: "Posts" };

/** Exemplo de leitura no cliente (React Query) e escrita via Server Action. */
export default function PostsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Posts</h1>
      <CreatePostForm />
      <PostList limit={10} />
    </section>
  );
}
