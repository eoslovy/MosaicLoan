'use client';

import React from 'react';
import styles from '@/styles/investors/TotalContractsOverview.module.scss';
import ProgressGroup from '@/components/common/ProgressGroup';
import BasicCard from '@/components/common/BasicInfoCard';
import type { InvestOverview } from '@/types/pages';

const statusMap = {
  completed: { label: '상환완료', color: '#00C851' },
  active: { label: '상환중', color: '#FFBB33' },
  default: { label: '부실', color: '#FF4444' },
  transferred: { label: '소유권 이전', color: '#2E2E2E' },
};

interface Props {
  data: InvestOverview;
}

const TotalContractsOverview: React.FC<Props> = ({ data }) => {
  const { statusDistribution, totalContractCount, totalProfit, totalLoss } =
    data;

  const totalStatusCount = Object.values(statusDistribution).reduce(
    (sum, count) => sum + count,
    0,
  );

  const progressItems = Object.entries(statusDistribution).map(
    ([key, count]) => {
      const { label, color } = statusMap[key as keyof typeof statusMap];
      const percentage = totalStatusCount
        ? (count / totalStatusCount) * 100
        : 0;
      return {
        label,
        count,
        color,
        percentage: Number(percentage.toFixed(1)),
      };
    },
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h3 className={styles.title}>전체 채권 상태 분석</h3>
        <ProgressGroup title='채권 상태별 분포' items={progressItems} />
      </div>
      <div className={styles.right}>
        <BasicCard
          icon='creditCard'
          label='전체 채권 개수'
          value={`${totalContractCount.toLocaleString()}건`}
        />
        <BasicCard
          icon='trendingUp'
          label='수익금'
          value={`₩ ${totalProfit.toLocaleString()}`}
        />
        <BasicCard
          icon='triangleAlert'
          label='손실액'
          value={`₩ ${totalLoss.toLocaleString()}`}
        />
      </div>
    </div>
  );
};

export default TotalContractsOverview;
