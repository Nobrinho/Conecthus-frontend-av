/** Fonte única das rotas da aplicação — evita strings soltas pelo código. */
export const routes = {
  home: "/",
  login: "/login",
  forgotPassword: "/recuperar-senha",
  resetPassword: "/redefinir-senha",
  users: "/usuarios",
  newUser: "/usuarios/cadastro",
  editUser: (id: string) => `/usuarios/${id}/editar`,
} as const;

/** Rotas acessíveis sem sessão. Quem já está logado é mandado para a home. */
export const publicRoutes: readonly string[] = [
  routes.login,
  routes.forgotPassword,
  routes.resetPassword,
];
