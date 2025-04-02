import { PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';

// MswClient를 동적 임포트
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
