'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/LoanSummarySection.module.scss';
import LoanDetailSlider from '@/components/borrower/LoanDetailSlider';
import Button from '@/components/common/Button';
import {
  getRecentCreditEvaluation,
  postCreditEvaluation,
} from '@/service/apis/borrow';
import LoanModal from './LoanModal';

interface Props {
  recentLoans: {
    dueDate: string;
    principal: number;
    interestRate: number;
    amount: number;
  }[];
}

const LoanSummarySection = ({ recentLoans }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [maxLoanLimit, setMaxLoanLimit] = useState<number>(0);

  const handleLoanClick = async () => {
    try {
      const result = await getRecentCreditEvaluation();

      if (!result || !result.maxLoanLimit) {
        throw new Error('대출 가능 정보 없음');
      }

      setMaxLoanLimit(result.maxLoanLimit);
      setModalOpen(true);
    } catch {
      try {
        const today = new Date().toISOString().split('T')[0];
        const result = await postCreditEvaluation(today);

        if (!result || !result.maxLoanLimit) {
          throw new Error('신용평가 실패');
        }

        setMaxLoanLimit(result.maxLoanLimit);
        setModalOpen(true);
      } catch {
        setError('신용 평가 데이터를 불러오지 못했습니다.');
        setTimeout(() => setError(null), 3000); // 3초 후 사라짐
      }
    }
  };

  return (
    <section className={styles.wrapper}>
      {error && <div className={styles.globalErrorToast}>{error}</div>}

      <div className={styles.content}>
        <div className={styles.left}>
          <LoanDetailSlider recentLoans={recentLoans} />
        </div>
        <div className={styles.right}>
          <div className={styles.bottomButton}>
            <Button
              label={{ text: '대출하기', size: 'xl', color: 'white' }}
              variant='filled'
              size='large'
              onClick={handleLoanClick}
            />
          </div>
        </div>
      </div>

      <LoanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        maxLoanLimit={maxLoanLimit}
      />
    </section>
  );
};

export default LoanSummarySection;
