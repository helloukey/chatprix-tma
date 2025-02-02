"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps } from "react";
import { initData, useSignal } from "@telegram-apps/sdk-react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const data = useSignal(initData.user);
  console.log(data);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
