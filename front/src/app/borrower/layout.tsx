'use client';

import React from 'react';
import BorrowSectionTabNav from '@/components/layout/BorrowSectionTabNav';

const BorrowerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='bg-[#fafaf8]'>
      <BorrowSectionTabNav />
      {children}
    </main>
  );
};

export default BorrowerLayout;
