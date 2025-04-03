'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import request from '@/service/apis/request';
import type { UserResponse, User } from '@/types/user';

const useUser = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const isFetched = useUserStore((state) => state.isFetched);
  const setIsFetched = useUserStore((state) => state.setIsFetched);
  const [isLoading, setIsLoading] = useState(!isFetched);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isFetched) return;

    const fetchUser = async () => {
      try {
        const response = await request.GET<UserResponse['data']>('/member/me');
        console.log('[useUser] 응답:', response);

        if (response?.name) {
          const convertedUser: User = {
            id: response.id,
            username: response.name,
            oauthProvider: response.oauthProvider,
          };
          console.log('[useUser] 저장할 유저:', convertedUser);
          setUser(convertedUser);
        } else {
          console.log('[useUser] 사용자 없음 → null');
          setUser(null);
        }

      } catch (err) {
        console.error('[useUser] 에러 발생:', err);
        setUser(null);
        setError(err as Error);
      } finally {
        setIsFetched(true);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [isFetched]);

  return { user, isFetched, isLoading, error };
};

export default useUser;
