'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useUser from '@/hooks/useUser';
import type { FC, ComponentType } from 'react';

const withAuthProtection = <P extends object>(
  Component: ComponentType<P>,
): FC<P> => {
  const Wrapper: FC<P> = (props) => {
    const { user, isFetched, isLoading } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (mounted && !isLoading && isFetched && !user) {
        router.push('/investor');
      }
    }, [isFetched, user, isLoading, mounted, router]);

    if (!mounted) return null;
    
    if (isLoading || (!user && isFetched)) return null;

    return <Component {...props} />;
  };

  return Wrapper;
};

export default withAuthProtection;
