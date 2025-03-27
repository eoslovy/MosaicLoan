'use client';

import React, { useState } from 'react';
import SectionTabNav from '@/components/layout/SectionTabNav';
import type { TextProps, SectionTab } from '@/types/components';
import Overview from '@/components/investor/Overview';
import OverviewTable from '@/components/investor/OverviewTable';
import OverviewInvestSimulation from '@/components/investor/OverviewInvestSimulation';

const InvestorPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const title: TextProps = {
    text: '투자하기',
    size: 'text-3xl',
    color: 'primary-blue',
    weight: 'bold',
  };

  const description: TextProps = {
    text: '투자 현황 및 수익 내역을 확인해 보세요',
    size: 'md',
    color: 'gray',
    weight: 'regular',
  };

  const tabs: SectionTab[] = [
    {
      label: { text: '개요', size: 'sm', color: 'gray' },
      href: '/investor/overview',
    },
    {
      label: { text: '채권 거래 내역', size: 'sm', color: 'gray' },
      href: '/investor/transactions',
    },
    {
      label: { text: '채권 통계', size: 'sm', color: 'gray' },
      href: '/investor/statistics',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <Overview />
            <OverviewTable />
            <OverviewInvestSimulation />
          </>
        );
      // case 1:
      //   return <Transactions />;
      // case 2:
      //   return <Statistics />;
      default:
        return null;
    }
  };

  return (
    <main className=' bg-[#fafaf8]'>
      <SectionTabNav
        title={title}
        description={description}
        tabs={tabs}
        activeIndex={activeTab}
        onTabClick={setActiveTab}
      />

      {/* 탭에 따라 다른 페이지 로딩하기기기 */}
      <div className='mt-10'>{renderTabContent()}</div>
    </main>
  );
};

export default InvestorPage;
