"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps, useEffect } from "react";
import { initDataUser } from "@telegram-apps/sdk-react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  useEffect(() => {
    const user = initDataUser();
    console.log("user", user);
  }, []);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
