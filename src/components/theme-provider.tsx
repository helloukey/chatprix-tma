"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps } from "react";
import { initData } from "@telegram-apps/sdk-react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
    const user = initData.user;
    console.log(user);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
