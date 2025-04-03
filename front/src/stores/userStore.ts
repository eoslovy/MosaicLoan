import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

export interface UserStore {
  user: User | null;
  isFetched: boolean;
  setUser: (user: User | null) => void;
  setIsFetched: (fetched: boolean) => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      isFetched: false,
      setUser: (user) => set({ user }),
      setIsFetched: (fetched) => set({ isFetched: fetched }),
    }),
    {
      name: 'user-store',
      partialize: (state): UserStore => ({
        user: null,
        isFetched: state.isFetched,
        setUser: () => {},
        setIsFetched: () => {},
      }),
    },
  ),
);
