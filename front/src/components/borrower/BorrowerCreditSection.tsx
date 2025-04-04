'use client';

import React from 'react';
import StatCard from '@/components/common/StatCard';
import styles from '@/styles/uis/StatsSection.module.scss';

const BorrowerCreditSection: React.FC = () => {
  return (
    <div className={styles.singleCardWrapper}>
      <StatCard
        icon='trendingUp'
        value='800'
        label='나의 신용점수'
        unitOverride='점'
      />
      <StatCard
        icon='trendingUp'
        value='1250000000'
        label='대출한도'
        unitOverride='원'
      />
      <StatCard
        icon='trendingUp'
        value='8.5'
        label='적용금리'
        unitOverride='%'
      />
    </div>
  );
};

export default BorrowerCreditSection;
