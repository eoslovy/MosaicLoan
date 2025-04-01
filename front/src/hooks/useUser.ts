'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

const useUser = () => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/me`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error();
        const data = await res.json();

        if (data && data.username) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [setUser]);

  return user;
};

export default useUser;
