'use client';

import React from 'react';
import styles from '@/styles/investors/TotalContractsOverview.module.scss';
import ProgressGroup from '@/components/common/ProgressGroup';
import BasicCard from '@/components/common/BasicInfoCard';
// import { TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

const TotalContractsOverview = () => {
  const progressItems = [
    { label: '상환완료', count: 35, percentage: 29.2, color: '#00C851' },
    { label: '상환중', count: 45, percentage: 29.2, color: '#FFBB33' },
    { label: '부실', count: 35, percentage: 29.2, color: '#FF4444' },
    { label: '소유권 이전', count: 35, percentage: 29.2, color: '#2E2E2E' },
  ];

  return (
    <div className={styles.wrapper}>
      {/* 왼쪽: ProgressGroup */}
      <div className={styles.left}>
        <h3 className={styles.title}>전체 채권 상태 분석</h3>
        <ProgressGroup title='채권 상태별 분포' items={progressItems} />
      </div>

      {/* 오른쪽: 세로로 카드 3개 */}
      <div className={styles.right}>
        <BasicCard
          icon='creditCard'
          label='전체 채권 개수'
          value='1,250,000,000 + 개'
        />
        <BasicCard icon='creditCard' label='수익금' value='₩ 1,250,000,000 +' />
        <BasicCard icon='creditCard' label='손실액' value='₩ 1,250,000,000 +' />
      </div>
    </div>
  );
};

export default TotalContractsOverview;
