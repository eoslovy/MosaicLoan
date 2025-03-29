'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import InvestSectionTabNav from '@/components/layout/InvestSectionTabNav';

const tabPaths = [
  '/investor/overview',
  '/investor/contracts',
  '/investor/statistics',
];

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = tabPaths.findIndex((path) => pathname.startsWith(path));
  const handleTabClick = (index: number) => {
    router.push(tabPaths[index]);
  };

  return (
    <main className="bg-[#fafaf8]">
      <InvestSectionTabNav activeIndex={activeIndex} onTabClick={handleTabClick} />
      {children}
    </main>
  );
}
