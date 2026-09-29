import Link from "next/link";

import { routes } from "@/config/routes";

import type { Post } from "../types";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="border-border hover:bg-muted rounded-lg border p-4 transition-colors">
      <Link href={routes.post(post.id)} className="block space-y-2">
        <h2 className="font-semibold capitalize">{post.title}</h2>
        <p className="text-muted-foreground line-clamp-2 text-sm">{post.body}</p>
      </Link>
    </article>
  );
}
