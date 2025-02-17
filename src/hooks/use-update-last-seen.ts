import { updateUserLastSeen } from "@/firebase/user";
import { useUserState } from "@/zustand/useStore";
import { useEffect } from "react";

const useUpdateLastSeen = () => {
  const { userId } = useUserState((state) => state);
  // Update user lastSeen every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        updateUserLastSeen(userId);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  return null;
};

export { useUpdateLastSeen };
