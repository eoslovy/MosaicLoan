'use client';

import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8080/me', {
      credentials: 'include', // access-token 쿠키 포함
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then((data) => setUser(data.data))
      .catch(() => setUser(null));
  }, []);

  return user;
}
