// API pública da feature: importe sempre por "@/features/posts", nunca por caminhos internos.
export { createPostAction } from "./actions";
export { postsApi } from "./api/posts.api";
export { postKeys } from "./api/query-keys";
export { CreatePostForm } from "./components/create-post-form";
export { PostCard } from "./components/post-card";
export { PostList } from "./components/post-list";
export { useCreatePost } from "./hooks/use-create-post";
export { usePosts } from "./hooks/use-posts";
export { type CreatePostInput, createPostSchema, type Post, postSchema } from "./types";
