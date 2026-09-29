/** Query keys centralizadas — facilitam invalidação e evitam colisões. */
export const postKeys = {
  all: ["posts"] as const,
  list: (params: { limit?: number } = {}) => [...postKeys.all, "list", params] as const,
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
};
