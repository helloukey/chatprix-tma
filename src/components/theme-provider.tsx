"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps } from "react";
import { initDataUser } from "@telegram-apps/sdk-react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const user = initDataUser();
  console.log("user", user);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
