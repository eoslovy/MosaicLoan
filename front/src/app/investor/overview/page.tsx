'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Overview from '@/components/investor/Overview';
import OverviewTable from '@/components/investor/OverviewTable';
import OverviewInvestSimulation from '@/components/investor/OverviewInvestSimulation';
import InvestButton from '@/components/investor/InvestButton';
import EmptyState from '@/components/empty/investor/EmptyState';
import { fetchInvestmentOverview } from '@/service/apis/investments';
import InvestorOverviewSkeleton from '@/components/loading/InvestorOverviewSkeleton';

const OverviewPage = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['investmentOverview'],
    queryFn: fetchInvestmentOverview,
  });

  if (isLoading) {
    return <InvestorOverviewSkeleton />;
  }

  if (isError || !data) {
    return <EmptyState message='투자 개요 정보를 불러올 수 없습니다.' />;
  }

  return (
    <>
      <InvestButton />
      <Overview />
      <OverviewTable
        investlist={data.investlist}
        profitHistory={data.profitHistory}
      />
      <OverviewInvestSimulation />
    </>
  );
};

export default OverviewPage;
