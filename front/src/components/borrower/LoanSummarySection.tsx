'use client';

import React from 'react';
import styles from '@/styles/borrowers/LoanSummarySection.module.scss';
import LoanDetailSlider from '@/components/borrower/LoanDetailSlider';
import Button from '@/components/common/Button';

interface Props {
  recentLoans: {
    dueDate: string;
    principal: number;
    interest: number;
    amount: number;
  }[];
}

const LoanSummarySection = ({ recentLoans }: Props) => {
  return (
    <section className={styles.wrapper}>
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
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanSummarySection;
