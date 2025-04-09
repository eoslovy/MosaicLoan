'use client';

import React, { useEffect, useState } from 'react';
import Overview from '@/components/investor/Overview';
import OverviewTable from '@/components/investor/OverviewTable';
import OverviewInvestSimulation from '@/components/investor/OverviewInvestSimulation';
import InvestButton from '@/components/investor/InvestButton';
import InvestorOverviewSkeleton from '@/components/loading/InvestorOverviewSkeleton';
import type { InvestmentOverviewResponse } from '@/types/pages';
import request from '@/service/apis/request';

const OverviewPage = () => {
  const [data, setData] = useState<InvestmentOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const result = await request.GET<InvestmentOverviewResponse>(
          '/contract/investments/overview',
        );
        setData(result);
      } catch (e: unknown) {
        if (process.env.NODE_ENV === 'development') {
          if (e instanceof Error) {
            console.error('투자 개요 정보를 불러오지 못했습니다.', e.message);
          } else {
            console.error('알 수 없는 오류 발생', e);
          }
        }
        // 에러가 발생해도 빈 데이터 구조를 설정
        setData({
          summary: {
            총투자금액: '',
            누적수익금: '',
            평균수익률: 0,
            투자건수: 0,
          },
          investlist: [],
          profitHistory: [],
          simulation: {},
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (isLoading) {
    return <InvestorOverviewSkeleton />;
  }

  return (
    <>
      <InvestButton />
      <Overview
        summary={
          data?.summary || {
            총투자금액: '',
            누적수익금: '',
            평균수익률: 0,
            투자건수: 0,
          }
        }
      />
      <OverviewTable
        investlist={data?.investlist || []}
        profitHistory={data?.profitHistory || []}
      />
      <OverviewInvestSimulation />
    </>
  );
};

export default OverviewPage;
