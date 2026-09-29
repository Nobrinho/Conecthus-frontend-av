/** Fonte única das rotas da aplicação — evita strings soltas pelo código. */
export const routes = {
  home: "/",
  posts: "/posts",
  post: (id: number | string) => `/posts/${id}`,
} as const;
