'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/my/myInfo');
  }, [router]);

  return null; // 아무것도 렌더링하지 않음
};

export default Page;
