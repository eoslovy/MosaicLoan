'use client';

import { useEffect } from 'react';
import {useUserStore} from '@/stores/userStore';

const useUser = () => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8080/me', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error();
        const data = await res.json();
        // console.log('[useUser] /me 응답:', data);

        if (data && data.username) {
          // console.log('[useUser] setUser 실행');
          setUser(data);
        } else {
          // console.log('[useUser] 응답에 data 없음, setUser(null)');
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
