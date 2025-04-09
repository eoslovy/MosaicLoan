'use client';

import React from 'react';
import BorrowSectionTabNav from '@/components/layout/BorrowSectionTabNav';
// import withAuthProtection from '@/components/auth/withAuthProtection';

const BorrowerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='bg-[#fafaf8]'>
      <BorrowSectionTabNav />
      {children}
    </main>
  );
};

export default BorrowerLayout;
