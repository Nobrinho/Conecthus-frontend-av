// API pública da feature: importe sempre por "@/features/auth", nunca por caminhos internos.
export { forgotPasswordAction, loginAction, logoutAction, resetPasswordAction } from "./actions";
export { AuthShell } from "./components/auth-shell";
export { ForgotPasswordForm } from "./components/forgot-password-form";
export { LoginForm } from "./components/login-form";
export { ResetPasswordForm } from "./components/reset-password-form";
export { Splash } from "./components/splash";
export {
  type ForgotPasswordInput,
  forgotPasswordSchema,
  type LoginInput,
  loginSchema,
  type ResetPasswordInput,
  resetPasswordSchema,
  type SessionUser,
} from "./types";
