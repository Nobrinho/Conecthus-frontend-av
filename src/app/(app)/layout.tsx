import { cookies } from "next/headers";

import { AppShell } from "@/components/layout";
import { parseTheme, SIDEBAR_COOKIE, THEME_COOKIE } from "@/config/theme";
import { logoutAction } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const [user, store] = await Promise.all([getCurrentUser(), cookies()]);

  return (
    <AppShell
      user={user}
      theme={parseTheme(store.get(THEME_COOKIE)?.value)}
      sidebarCollapsed={store.get(SIDEBAR_COOKIE)?.value === "collapsed"}
      logoutAction={logoutAction}
    >
      {children}
    </AppShell>
  );
}
