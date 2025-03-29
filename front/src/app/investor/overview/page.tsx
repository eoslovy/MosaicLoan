'use client';

import React from 'react';
import Overview from '@/components/investor/Overview';
import OverviewTable from '@/components/investor/OverviewTable';
import OverviewInvestSimulation from '@/components/investor/OverviewInvestSimulation';

const OverviewPage = () => {
  return (
    <>
      <Overview />
      <OverviewTable />
      <OverviewInvestSimulation />
    </>
  );
};

export default OverviewPage;
