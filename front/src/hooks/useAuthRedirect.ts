'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useUserDelay from './useUserDelay';

const useAuthRedirect = (redirectPath: string) => {
  const { user, isReady } = useUserDelay(1000); // 1초 대기 + 로그인 체크
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace(redirectPath);
    }
  }, [user, isReady, router]);
};

export default useAuthRedirect;
