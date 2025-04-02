'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { httpClient } from '@/service/apis/apiClient';

const useUser = () => {
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data } = await httpClient.get('/member/me');
        
        if (data && data.username) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('사용자 정보를 가져오는데 실패했습니다.'));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  return { user, isLoading, error };
};

export default useUser;
