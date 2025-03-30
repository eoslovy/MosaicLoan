'use client';

import React, { useState } from 'react';
import MyPageSectionTabNav from '@/components/my/MyPageSectionTabNav';

const MyPage = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
  };

  const renderTabContent = () => {
    switch (activeTabIndex) {
      case 0:
        return <p>계정정보 탭 내용</p>;
      case 1:
        return <p>계좌내역 탭 내용</p>;
      default:
        return null;
    }
  };

  return (
    <main>
      <MyPageSectionTabNav
        activeIndex={activeTabIndex}
        onTabClick={handleTabClick}
      />
      <section className='mt-6'>{renderTabContent()}</section>
    </main>
  );
};

export default MyPage;
