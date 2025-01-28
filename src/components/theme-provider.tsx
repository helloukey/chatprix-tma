"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { backButton, init } from "@telegram-apps/sdk-react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Initialize the package.
  init();
  backButton.mount();
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
