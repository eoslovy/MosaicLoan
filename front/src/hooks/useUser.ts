'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import request from '@/service/apis/request';
import type { UserResponse, User } from '@/types/user';
import { AxiosError } from 'axios';

const useUser = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const isFetched = useUserStore((state) => state.isFetched);
  const setIsFetched = useUserStore((state) => state.setIsFetched);
  const isHydrated = useUserStore((state) => state.isHydrated);

  const [isApiLoading, setIsApiLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const hasFullUserInfo = user && Object.keys(user).length > 1;
    if (isFetched && hasFullUserInfo) return;

    const fetchUser = async () => {
      setIsApiLoading(true);
      try {
        const response = await request.GET<UserResponse['data']>('/member/me');

        if (response) {
          const convertedUser: User = {
            id: response.id,
            username: response.name,
            oauthProvider: response.oauthProvider,
            createdAt: response.createdAt,
          };
          console.log('[useUser] 저장할 유저:', convertedUser);
          setUser(convertedUser);
        } else {
          console.log('[useUser] 사용자 없음 → null');
          setUser(null);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          console.info('[useUser] 로그인되지 않은 상태 (401)');
        } else {
          console.error('[useUser] 에러 발생:', err);
        }
        setUser(null);
        setError(err as Error);
      } finally {
        setIsFetched(true);
        setIsApiLoading(false);
      }
    };

    if (isHydrated) {
      fetchUser();
    }
  }, [mounted, isFetched, user, setIsFetched, setUser, isHydrated]);

  const isLoading = !isHydrated || isApiLoading;

  return {
    user,
    isFetched,
    isLoading,
    isHydrated,
    error,
  };
};

export default useUser;
