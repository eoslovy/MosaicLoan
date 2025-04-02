'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import type { UserResponse } from '@/types/user';
import request from '@/service/apis/request';

const useUser = () => {
  const { user, setUser, isFetched, setIsFetched } = useUserStore();
  const [isLoading, setIsLoading] = useState(!isFetched);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isFetched) return;

    const fetchUser = async () => {
      try {
        const response = await request.GET<UserResponse>('/member/me');
        if (response.data?.username) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
        setError(err as Error);
      } finally {
        setIsFetched(true); // 한 번만 요청되도록 해둠
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [isFetched]);

  return { user, isLoading, error };
};

export default useUser;
