'use client';

import React from 'react';
import BasicInfoCard from '@/components/common/BasicInfoCard';
import styles from '@/styles/borrowers/LoanOverview.module.scss';

const LoanOverview = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <BasicInfoCard
          icon='creditCard'
          label='진행중 대출 / 총 대출'
          value='5 / 15건'
        />
        <BasicInfoCard
          icon='trendingUp'
          label='총 대출 금액'
          value='₩125,000,000'
        />
        <BasicInfoCard icon='clock' label='평균 금리' value='8.2 %' />
        <BasicInfoCard icon='arrowUpRight' label='상환율' value='80 %' />
      </div>
    </section>
  );
};

export default LoanOverview;
