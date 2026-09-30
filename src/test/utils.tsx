import { render, type RenderOptions } from "@testing-library/react";

import { ToastProvider } from "@/components/ui";

/** Render com os providers globais da aplicação. */
export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(<ToastProvider>{ui}</ToastProvider>, options);
}
