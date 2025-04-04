'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/investors/TotalContractsOverview.module.scss';
import ProgressGroup from '@/components/common/ProgressGroup';
import BasicCard from '@/components/common/BasicInfoCard';
import type { ContractSummaryResponse } from '@/types/pages';
import request from '@/service/apis/request';

interface TotalContractsOverviewProps {
  data: ContractSummaryResponse;
}

const statusMap = {
  completed: { label: '상환완료', color: '#00C851' },
  active: { label: '상환중', color: '#FFBB33' },
  default: { label: '부실', color: '#FF4444' },
  transferred: { label: '소유권 이전', color: '#2E2E2E' },
};

const TotalContractsOverview: React.FC = () => {
  const [data, setData] = useState<ContractSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractSummary = async () => {
      try {
        setIsLoading(true);
        // request.GET을 사용하여 API 요청
        const summaryData = await request.GET<ContractSummaryResponse>(
          '/api/contract/contracts/summary',
        );
        setData(summaryData);
      } catch (err) {
        console.error('계약 요약 데이터를 불러오는 중 오류 발생:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractSummary();
  }, []);

  if (error) {
    return <div className='error-message'>{error}</div>;
  }

  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }

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
