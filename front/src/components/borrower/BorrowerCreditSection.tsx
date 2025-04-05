'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/common/StatCard';
import styles from '@/styles/uis/StatsSection.module.scss';
import request from '@/service/apis/request';
import Button from '@/components/common/Button';

interface CreditEvaluation {
  maxLoanLimit: number;
  interestRate: number; // 만분율 (예: 850 => 8.5%)
  creditScore: number;  // 0 ~ 1000
}

const BorrowerCreditSection = () => {
  const [data, setData] = useState<CreditEvaluation | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const result = await request.GET<CreditEvaluation>(
          '/api/credit/evaluations/recent',
        );
        setData(result);
      } catch (e) {
        console.error('신용 평가 데이터를 불러오지 못했습니다.', e);
        setIsError(true);
      }
    };

    fetchCredit();
  }, []);

  if (isError) {
    return (
      <div className={styles.singleCardWrapper}>
        <Button
              label={{ text: '신용평가하기', size: 'sm', color: 'white' }}
              variant='filled'
              size='normal'
            />
      </div>
    )
  }

  if (!data) {
    return <div>Loading...</div>; // 혹은 Skeleton 처리
  }

  return (
    <div className={styles.singleCardWrapper}>
      <StatCard
        icon="trendingUp"
        value={data.creditScore.toLocaleString()}
        label="나의 신용점수"
        unitOverride="점"
      />
      <StatCard
        icon="trendingUp"
        value={data.maxLoanLimit.toLocaleString()}
        label="대출한도"
        unitOverride="원"
      />
      <StatCard
        icon="trendingUp"
        value={(data.interestRate / 100).toFixed(2)}
        label="적용금리"
        unitOverride="%"
      />
    </div>
  );
};

export default BorrowerCreditSection;
