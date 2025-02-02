"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const data = retrieveLaunchParams();
  console.log(data);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
