'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/common/StatCard';
import styles from '@/styles/uis/StatsSection.module.scss';
import {
  getRecentCreditEvaluation,
  CreditEvaluation,
} from '@/service/apis/borrow';
import BorrowButton from '@/components/borrower/BorrowButton';

const BorrowerCreditSection = ({ onComplete }: { onComplete: () => void }) => {
  const [data, setData] = useState<CreditEvaluation | null>(null);
  const [isError, setIsError] = useState(false);

  const fetchCredit = async () => {
    console.log('[DEBUG] BorrowerCreditSection mounted');
    try {
      const result = await getRecentCreditEvaluation();
      setData(result);
      setIsError(false);
    } catch (e) {
      console.error('신용 평가 데이터를 불러오지 못했습니다.', e);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchCredit();
  }, []);

  if (isError) {
    return (
      <div className={`${styles.singleCardWrapper} ${styles.errorState}`}>
        <BorrowButton
          onComplete={() => {
            onComplete();
            fetchCredit();
          }}
        />
      </div>
    );
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.singleCardWrapper}>
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
