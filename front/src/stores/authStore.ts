import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserInfoType } from '@/types/user';
import request from '@/service/apis/request';

interface AuthStore {
  user: UserInfoType | null;
  isAuthenticated: boolean;
  fetchUserInfo: () => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      fetchUserInfo: async () => {
        try {
          const response = await request.GET<UserInfoType>('/member/me');

          if (response) {
            set({ user: response, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
