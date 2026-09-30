import "server-only";

import { z } from "zod";

import { authHttp } from "@/lib/api";

import { paginatedUsersSchema, userSchema } from "../types";

export interface ListUsersParams {
  page?: number;
  search?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  registration: string;
  password?: string;
}

export const usersApi = {
  list: ({ page = 1, search }: ListUsersParams) =>
    authHttp.get("/users", {
      schema: paginatedUsersSchema,
      query: { page, search: search || undefined },
    }),

  get: (id: string) => authHttp.get(`/users/${id}`, { schema: userSchema }),

  create: (body: Required<UserPayload>) => authHttp.post("/users", { schema: userSchema, body }),

  update: (id: string, body: Partial<UserPayload>) =>
    authHttp.patch(`/users/${id}`, { schema: userSchema, body }),

  remove: (id: string) => authHttp.delete(`/users/${id}`, { schema: z.null() }),
};
