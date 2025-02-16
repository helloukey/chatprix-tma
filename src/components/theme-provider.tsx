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
import { checkAndUpdateUser, updateUserLastSeen } from "@/firebase/user";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const { setLoading, setUser, userId, setUserId, setIsPro } = useUserState(
    (state) => state
  );

  // Perform telegram check
  const performTelegramCheck = useCallback(async () => {
    try {
      setLoading(true);
      const { tgWebAppData } = retrieveLaunchParams();
      if (tgWebAppData && tgWebAppData.user) {
        checkAndUpdateUser(tgWebAppData.user.id, setUser, setUserId, setIsPro);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser, setUserId, setIsPro]);

  useEffect(() => {
    // Init telegram sdk
    if (isTMA()) {
      init();
      backButton.mount();
      performTelegramCheck();
    }
  }, [performTelegramCheck]);

  // Update user lastSeen every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        updateUserLastSeen(userId);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
