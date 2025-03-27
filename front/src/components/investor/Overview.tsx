'use client';

import React from 'react';
import BasicInfoCard from '@/components/common/BasicInfoCard';
import styles from '@/styles/investors/Overview.module.scss';

const Overview = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.cardWrapper}>
        <BasicInfoCard
          icon='creditCard'
          value='₩ 1,000,000,000'
          label='총 투자 금액'
        />
        <BasicInfoCard
          icon='trendingUp'
          value='₩ 1,250,000,000'
          label='누적 수익금'
        />
        <BasicInfoCard icon='clock' value='8.3 %' label='평균 수익률' />
        <BasicInfoCard icon='arrowUpRight' value='50건' label='투자 건수' />
      </div>
    </section>
  );
};

export default Overview;
