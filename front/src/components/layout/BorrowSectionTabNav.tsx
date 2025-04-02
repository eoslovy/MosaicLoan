'use client';

import React from 'react';
import SectionTabNav from '@/components/ui/SectionTabNav';
import type { TextProps } from '@/types/components';

const BorrowSectionTabNav = () => {
  const title: TextProps = {
    text: '대출하기',
    size: 'text-3xl',
    color: 'primary-blue',
    weight: 'bold',
  };

  const description: TextProps = {
    text: '나의 신용점수를 바탕으로 편리한 대출을 진행합니다',
    size: 'md',
    color: 'gray',
    weight: 'regular',
  };

  return (
    <SectionTabNav
      title={title}
      description={description}
      tabs={[]}
      activeIndex={0}
      onTabClick={() => {}}
    />
  );
};

export default BorrowSectionTabNav;
