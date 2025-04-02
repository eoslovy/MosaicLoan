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
        const { data } = await httpClient.get('/member/me');
        if (data && data.username) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  

  return { user, isLoading, error };
};

export default useUser;
