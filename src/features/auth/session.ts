import "server-only";

import { cache } from "react";

import { authApi } from "./api/auth.api";

/**
 * Usuário logado da requisição atual. `cache` evita chamar `/auth/me` mais de
 * uma vez por render (layout e página podem pedir ao mesmo tempo).
 */
export const getCurrentUser = cache(() => authApi.me());
