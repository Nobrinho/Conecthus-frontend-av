"use client";

import { Button, Spinner } from "@/components/ui";

import { usePosts } from "../hooks/use-posts";

import { PostCard } from "./post-card";

export function PostList({ limit = 10 }: { limit?: number }) {
  const { data, isPending, isError, refetch } = usePosts({ limit });

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 py-10 text-center">
        <p>Não foi possível carregar os posts.</p>
        <Button variant="secondary" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
