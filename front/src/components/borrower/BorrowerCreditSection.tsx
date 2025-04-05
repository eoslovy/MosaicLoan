'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/common/StatCard';
import styles from '@/styles/uis/StatsSection.module.scss';
import {
  getRecentCreditEvaluation,
  CreditEvaluation,
} from '@/service/apis/borrow';
// import Button from '@/components/common/Button';
import BorrowButton from '@/components/borrower/BorrowButton';

const BorrowerCreditSection = () => {
  const [data, setData] = useState<CreditEvaluation | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const result = await getRecentCreditEvaluation();
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
      <div className={`${styles.singleCardWrapper} ${styles.errorState}`}>
        <BorrowButton />
      </div>
    );
  }

  if (!data) {
    return <div>Loading...</div>; // 혹은 Skeleton 처리
  }

  return (
    <div className={styles.singleCardWrapper}>
      <StatCard
        icon='trendingUp'
        value={data.creditScore.toLocaleString()}
        label='나의 신용점수'
        unitOverride='점'
      />
      <StatCard
        icon='trendingUp'
        value={data.maxLoanLimit.toLocaleString()}
        label='대출한도'
        unitOverride='원'
      />
      <StatCard
        icon='trendingUp'
        value={(data.interestRate / 100).toFixed(2)}
        label='적용금리'
        unitOverride='%'
      />
    </div>
  );
};

export default BorrowerCreditSection;
