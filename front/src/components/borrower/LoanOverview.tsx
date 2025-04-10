'use client';

import React from 'react';
import BasicInfoCard from '@/components/common/BasicInfoCard';
import styles from '@/styles/borrowers/LoanOverview.module.scss';

interface Props {
  activeLoanCount: number;
  totalCount: number;
  activeLoanAmount: number;
  averageInterestRate: number;
}

const LoanOverview = ({
  activeLoanCount,
  totalCount,
  activeLoanAmount,
  averageInterestRate,
}: Props) => {
  // 에러거나 0이면 그냥 0으로 하기
  const safeActiveLoanCount =
    Number.isNaN(activeLoanCount) || activeLoanCount < 1 ? 0 : activeLoanCount;
  const safeTotalCount =
    Number.isNaN(totalCount) || totalCount < 1 ? 0 : totalCount;
  const safeLoanAmount =
    Number.isNaN(activeLoanAmount) || activeLoanAmount < 1
      ? 0
      : activeLoanAmount;
  const safeAvgRate =
    Number.isNaN(averageInterestRate) || averageInterestRate < 1
      ? '0.00'
      : (averageInterestRate / 10000).toFixed(2);

  return (
    <section className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <BasicInfoCard
          icon='creditCard'
          label='진행중 대출 / 총 대출'
          value={`${safeActiveLoanCount} / ${safeTotalCount}건`}
        />
        <BasicInfoCard
          icon='clock'
          label='완료 대출 평균 금리'
          value={`${safeAvgRate} %`}
        />
        <BasicInfoCard
          icon='arrowUpRight'
          label='상환중 금액'
          value={`${safeLoanAmount.toLocaleString()}원`}
        />
      </div>
    </section>
  );
};

export default LoanOverview;
