"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { backButton, init } from "@telegram-apps/sdk-react";
import { ComponentProps, useEffect } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  useEffect(() => {
    // Initialize the package.
    init();
    backButton.mount();
  }, []);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
