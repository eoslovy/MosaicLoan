'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/LoanSummarySection.module.scss';
import LoanDetailSlider from '@/components/borrower/LoanDetailSlider';
import Button from '@/components/common/Button';
import { useUserStore } from '@/stores/userStore';
import {
  getRecentCreditEvaluation,
  postCreditEvaluation,
} from '@/service/apis/borrow';
import LoanModal from './LoanModal';

interface Props {
  recentLoans: {
    dueDate: string;
    outstandingAmount: number;
    interestRate: number;
    amount: number;
  }[];
}

const LoanSummarySection = ({ recentLoans }: Props) => {
  const { user } = useUserStore();
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
      // 신용평가 정보 없을 경우: 토스트 표시 후 리턴-> 그냥 대출 모달창이 안 나오도록 하자
      setError('신용평가를 먼저 진행해 주세요.');
      setTimeout(() => setError(null), 3000);
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
