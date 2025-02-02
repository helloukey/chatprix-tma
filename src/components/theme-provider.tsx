"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps, useEffect, useCallback } from "react";
import {
  backButton,
  init,
  isTMA,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react";
import { useUserState } from "@/zustand/useStore";
import { checkAndUpdateUser } from "@/firebase/user";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const { setLoading, setUser } = useUserState((state) => state);

  // Perform telegram check
  const performTelegramCheck = useCallback(async () => {
    try {
      setLoading(true);
      const { tgWebAppData } = retrieveLaunchParams();
      if (tgWebAppData && tgWebAppData.user) {
        checkAndUpdateUser(tgWebAppData.user.id, setUser);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser]);

  useEffect(() => {
    // Init telegram sdk
    if (isTMA()) {
      init();
      backButton.mount();
      performTelegramCheck();
    }
  }, [performTelegramCheck]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
