// API pública da feature: importe sempre por "@/features/users", nunca por caminhos internos.
export { createUserAction, deleteUserAction, updateUserAction } from "./actions";
export { UserForm, type UserFormProps } from "./components/user-form";
export { UsersPage, type UsersPageProps } from "./components/users-page";
export { formatDate, formatRegistration } from "./format";
export { sanitizeName, sanitizeRegistration, USER_RULES } from "./rules";
export {
  createUserSchema,
  type PaginatedUsers,
  updateUserSchema,
  type User,
  type UserFormValues,
  userSchema,
} from "./types";
