'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/types/user';

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/me', {
      credentials: 'include', // access-token 쿠키 포함
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then((data) => {
        setUser(data.data); // 여기서 data.data의 구조가 User와 일치해야 함
      })
      .catch(() => setUser(null));
  }, []);

  return user;
};

export default useUser;
