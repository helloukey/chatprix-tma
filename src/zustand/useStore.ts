import { create } from "zustand";
import { DocumentData } from "firebase/firestore";

interface UserState {
  user: DocumentData | null;
  setUser: (user: DocumentData | null) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useUserState = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  userId: null,
  setUserId: (userId) => set({ userId }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export { useUserState };
