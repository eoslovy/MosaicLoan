import { create } from 'zustand';
import type { User } from '@/types/user';

export interface UserStore {
  user: User | null;
  isFetched: boolean;
  setUser: (user: User | null) => void;
  setIsFetched: (fetched: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isFetched: false,
  setUser: (user) => set({ user }),
  setIsFetched: (fetched) => set({ isFetched: fetched }),
}));
