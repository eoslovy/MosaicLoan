import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

export interface UserStore {
  user: User | null;
  isFetched: boolean;
  setUser: (user: User | null) => void;
  setIsFetched: (fetched: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isFetched: false,
      setUser: (user) => set({ user }),
      setIsFetched: (fetched) => set({ isFetched: fetched }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        userId: state.user?.id || null,
        isFetched: state.isFetched,
      }),
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          return JSON.parse(localStorage.getItem(name) || 'null');
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        },
      },
    }
  ),
);
