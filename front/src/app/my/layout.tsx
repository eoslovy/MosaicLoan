'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import MyPageSectionTabNav from '@/components/my/MyPageSectionTabNav';
import withAuthProtection from '@/components/auth/withAuthProtection';

const tabPaths = ['/my/myInfo', '/my/myAccount'];

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = tabPaths.findIndex((path) => pathname.startsWith(path));
  const handleTabClick = (index: number) => {
    router.push(tabPaths[index]);
  };

  return (
    <main className='bg-[#fafaf8]'>
      <MyPageSectionTabNav
        activeIndex={activeIndex}
        onTabClick={handleTabClick}
      />
      <section className='mt-6'>{children}</section>
    </main>
  );
};

export default withAuthProtection(MyPageLayout);
