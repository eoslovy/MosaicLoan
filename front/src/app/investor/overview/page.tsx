'use client';

import React, { useEffect, useState } from 'react';
import Overview from '@/components/investor/Overview';
import OverviewTable from '@/components/investor/OverviewTable';
import OverviewInvestSimulation from '@/components/investor/OverviewInvestSimulation';
import InvestButton from '@/components/investor/InvestButton';
import EmptyState from '@/components/empty/investor/EmptyState';
import InvestorOverviewSkeleton from '@/components/loading/InvestorOverviewSkeleton';
import type { InvestmentOverviewResponse } from '@/types/pages';
import request from '@/service/apis/request';

const OverviewPage = () => {
  const [data, setData] = useState<InvestmentOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const result = await request.GET<InvestmentOverviewResponse>('/api/contract/investments/overview');
        setData(result);
      } catch (e: unknown) {
        if (process.env.NODE_ENV === 'development') {
          if (e instanceof Error) {
            console.error('투자 개요 정보를 불러오지 못했습니다.', e.message);
          } else {
            console.error('알 수 없는 오류 발생', e);
          }
        }
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (isLoading) {
    return <InvestorOverviewSkeleton />;
  }

  if (isError || !data) {
    return <EmptyState message='투자 개요 정보를 불러올 수 없습니다.' />;
  }

  return (
    <>
      <InvestButton />
      <Overview summary={data.summary} />
      <OverviewTable
        investlist={data.investlist}
        profitHistory={data.profitHistory}
      />
      <OverviewInvestSimulation />
    </>
  );
};

export default OverviewPage;
