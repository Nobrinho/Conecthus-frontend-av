import "server-only";

import { z } from "zod";

import { authHttp, http } from "@/lib/api";

import {
  authResponseSchema,
  type ForgotPasswordInput,
  type LoginInput,
  sessionUserSchema,
} from "../types";

export const authApi = {
  login: (body: LoginInput) => http.post("/auth/login", { schema: authResponseSchema, body }),

  logout: (refreshToken: string) =>
    http.post("/auth/logout", { schema: z.null(), body: { refreshToken } }),

  me: () => authHttp.get("/auth/me", { schema: sessionUserSchema }),

  forgotPassword: (body: ForgotPasswordInput) =>
    http.post("/auth/forgot-password", { schema: z.null(), body }),

  resetPassword: (body: { token: string; password: string }) =>
    http.post("/auth/reset-password", { schema: z.null(), body }),
};
