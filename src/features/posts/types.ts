import { z } from "zod";

export const postSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});

export const postListSchema = z.array(postSchema);

export const createPostSchema = z.object({
  title: z.string().trim().min(3, "O título precisa ter pelo menos 3 caracteres."),
  body: z.string().trim().min(10, "O conteúdo precisa ter pelo menos 10 caracteres."),
});

export type Post = z.infer<typeof postSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
