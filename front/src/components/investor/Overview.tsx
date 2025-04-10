'use client';

import React from 'react';
import BasicInfoCard from '@/components/common/BasicInfoCard';
import styles from '@/styles/investors/Overview.module.scss';
import EmptyState from '@/components/empty/investor/EmptyState';
import { InvestmentSummary } from '@/types/pages';

interface OverviewProps {
  summary: InvestmentSummary;
}

const Overview: React.FC<OverviewProps> = ({ summary }) => {
  const isEmpty = !summary || Object.values(summary).every((v) => !v);

  return (
    <section className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        {isEmpty ? (
          <div className={styles.emptyStateContainer}>
            <EmptyState
              message='투자 요약 정보가 아직 없습니다.'
              isComponentLevel
            />
          </div>
        ) : (
          <>
            <BasicInfoCard
              icon='creditCard'
              value={`₩ ${Number(summary.totalInvestmentAmount).toLocaleString()}`}
              label='총 투자 금액'
            />
            <BasicInfoCard
              icon='trendingUp'
              value={`₩ ${Number(summary.totalProfitAmount).toLocaleString()}`}
              label='누적 수익금'
            />
            <BasicInfoCard
              icon='clock'
              value={`${summary.averageProfitRate} %`}
              label='평균 수익률'
            />
            <BasicInfoCard
              icon='arrowUpRight'
              value={`${summary.investmentCount}건`}
              label='투자 건수'
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Overview;
