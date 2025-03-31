'use client';

import React, { useState } from 'react';
import MyPageSectionTabNav from '@/components/my/MyPageSectionTabNav';
import MyInfo from '@/components/my/MyInfo';
import MyAccount from '@/components/my/MyAccount';
import MyAccountTransactionList from '@/components/my/MyAccountTransactionList';

const MyPage = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
  };

  const renderTabContent = () => {
    switch (activeTabIndex) {
      case 0:
        return <MyInfo />;
      case 1:
        return (
          <>
            <MyAccount />
            <MyAccountTransactionList />
          </>
        );
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
