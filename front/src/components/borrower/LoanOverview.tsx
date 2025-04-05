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
  return (
    <section className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <BasicInfoCard
          icon='creditCard'
          label='진행중 대출 / 총 대출'
          value={`${activeLoanCount} / ${totalCount}건`}
        />
        <BasicInfoCard
          icon='clock'
          label='평균 금리'
          value={`${(averageInterestRate / 100).toFixed(2)} %`}
        />
        <BasicInfoCard
          icon='arrowUpRight'
          label='상환중 금액'
          value={`${activeLoanAmount.toLocaleString()}원`}
        />
      </div>
    </section>
  );
};

export default LoanOverview;
