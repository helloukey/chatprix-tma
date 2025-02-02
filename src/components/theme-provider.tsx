"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps, useEffect } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
    useEffect(() => {
      const lp = retrieveLaunchParams();

      console.log(lp.initData);
    }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
