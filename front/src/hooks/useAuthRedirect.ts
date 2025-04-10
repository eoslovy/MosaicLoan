'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUser from '@/hooks/useUser';

const useAuthRedirect = (redirectPath = '/') => {
  const router = useRouter();
  const { user, isFetched, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && isFetched && !user) {
      router.push(redirectPath);
    }
  }, [isFetched, user, isLoading, router, redirectPath, mounted]);
};

export default useAuthRedirect;
