'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';
import Hero from '@/components/layout/Hero';
import StatsSection from '@/components/ui/StatsSection';
import ServiceInfosSection from '@/components/ui/ServiceInfosSection';
import InvestmentCalculator from '@/components/ui/InvestmentCalculator';
import useUser from '@/hooks/useUser';

const Home = () => {
  const { user, isFetched } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isFetched || !user) return;

    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin');
      router.replace(redirectPath);
    }
  }, [isFetched, user]);

  return (
    <div className='w-full flex flex-col'>
      {/* 메인 콘텐츠 */}
      <main>
        <Hero />
        <StatsSection />
        <ServiceInfosSection />
        <div className='flex justify-center items-center px-4 py-20 bg-[#f9fafb]'>
          <InvestmentCalculator />
        </div>
      </main>

      {/* 푸터 */}
      {/* <footer className='mt-auto flex gap-6 flex-wrap items-center justify-center py-6'>
        ...
      </footer> */}
    </div>
  );
};

export default Home;
