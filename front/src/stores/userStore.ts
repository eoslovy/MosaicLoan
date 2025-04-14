import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/user';

export interface UserStore {
  user: User | null;
  isFetched: boolean;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  setIsFetched: (fetched: boolean) => void;
  setIsHydrated: (hydrated: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isFetched: false,
      isHydrated: false,
      setUser: (user) => set({ user }),
      setIsFetched: (fetched) => set({ isFetched: fetched }),
      setIsHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        isFetched: state.isFetched,
        isHydrated: state.isHydrated,
      }),
      storage: createJSONStorage(() => {
        // 서버사이드에서는 빈 스토리지 객체 반환
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setIsHydrated(true);
        }
      },
    },
  ),
);
