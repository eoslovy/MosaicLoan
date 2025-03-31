'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import BasicInfoCard from '@/components/common/BasicInfoCard';
import styles from '@/styles/investors/Overview.module.scss';
// import type { InvestmentSummary } from '@/types/pages';
import EmptyState from '@/components/empty/investor/EmptyState';
import { fetchInvestmentSummary } from '@/service/apis/investments';

const Overview = () => {
  const { data, isError } = useQuery({
    // , isLoading,
    queryKey: ['investmentOverviewSummary'],
    queryFn: fetchInvestmentSummary,
  });

  // if (isLoading) return <div className={styles.wrapper}>Loading...</div>;
  if (isError || !data || Object.values(data).every((v) => !v)) {
    return (
      <section className={styles.wrapper}>
        <EmptyState message='투자 요약 정보가 아직 없습니다.' />
      </section>
    );
  }
  const { 총투자금액, 누적수익금, 평균수익률, 투자건수 } = data;

  return (
    <section className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <BasicInfoCard
          icon='creditCard'
          value={`₩ ${Number(총투자금액).toLocaleString()}`}
          label='총 투자 금액'
        />
        <BasicInfoCard
          icon='trendingUp'
          value={`₩ ${Number(누적수익금).toLocaleString()}`}
          label='누적 수익금'
        />
        <BasicInfoCard
          icon='clock'
          value={`${평균수익률} %`}
          label='평균 수익률'
        />
        <BasicInfoCard
          icon='arrowUpRight'
          value={`${투자건수}건`}
          label='투자 건수'
        />
      </div>
    </section>
  );
};

export default Overview;
