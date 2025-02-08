import { create } from "zustand";
import { DocumentData } from "firebase/firestore";

interface UserState {
  user: DocumentData | null;
  setUser: (user: DocumentData | null) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  filterOpen: boolean;
  setFilterOpen: (filterOpen: boolean) => void;
}

const useUserState = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  userId: null,
  setUserId: (userId) => set({ userId }),
  isPro: false,
  setIsPro: (isPro) => set({ isPro }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  filterOpen: false,
  setFilterOpen: (filterOpen) => set({ filterOpen }),
}));

export { useUserState };
