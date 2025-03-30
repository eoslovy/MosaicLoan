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
    </div>
  );
};

export default BorrowerCreditSection;
