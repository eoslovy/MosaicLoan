'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useUser from '@/hooks/useUser';
import type { FC, ComponentType } from 'react';

const AuthLoadingSkeleton: FC = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin' />
    </div>
  );
};
const withAuthProtection = <P extends object>(
  Component: ComponentType<P>,
  redirectPath = '/',
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
        router.replace(redirectPath);
      }
    }, [user, isFetched, isLoading, mounted, router, redirectPath]);

    if (!mounted || isLoading) {
      return <AuthLoadingSkeleton />;
    }

    if (!user && isFetched) {
      return <AuthLoadingSkeleton />;
    }

    return <Component {...props} />;
  };

  return Wrapper;
};

export default withAuthProtection;
