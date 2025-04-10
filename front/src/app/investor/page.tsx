'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const InvestorPage = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectPath = '/investor/overview';

    localStorage.setItem('lastVisited', redirectPath);

    router.replace(redirectPath);
  }, [router]);

  return null;
};

export default InvestorPage;
