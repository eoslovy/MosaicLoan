'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUser from './useUser';

const useAuthRedirect = (redirectPath: string) => {
  const { user, isFetched } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isFetched && !user) {
      router.replace(redirectPath);
    }
  }, [user, isFetched]);
};

export default useAuthRedirect;
