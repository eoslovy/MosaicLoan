// 'use client';

import { useEffect, useState } from 'react';
import useUser from './useUser';

const useUserDelay = (delayMs = 1000) => {
  const [waitDone, setWaitDone] = useState(false);
  const { user, isFetched, isLoading, error } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setWaitDone(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return {
    user,
    isFetched,
    isLoading,
    error,
    isReady: waitDone && isFetched,
  };
};

export default useUserDelay;
