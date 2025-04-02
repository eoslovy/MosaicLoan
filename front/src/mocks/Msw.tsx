import { PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';

// MswClient는 CSR 전용으로 동적 import
const MswClient = dynamic(() => import('./MswClient'), {
  ssr: false,
});

const Msw = ({ children }: PropsWithChildren) => {
  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') {
    return children;
  }

  return <MswClient>{children}</MswClient>; // MswClient로 감싸서 반환
};

export default Msw;
