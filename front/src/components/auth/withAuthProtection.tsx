'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useUser from '@/hooks/useUser';
import type { FC, ComponentType } from 'react';

const withAuthProtection = <P extends object>(
  Component: ComponentType<P>,
): FC<P> => {
  const Wrapper: FC<P> = (props) => {
    const { user, isFetched } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (isFetched && !user) {
        router.push('/');
      }
    }, [isFetched, user]);

    if (!isFetched || !user) return null;

    return <Component {...props} />;
  };

  return Wrapper;
};

export default withAuthProtection;
