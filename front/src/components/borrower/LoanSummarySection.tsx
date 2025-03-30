'use client';

import React from 'react';
import styles from '@/styles/borrowers/LoanSummarySection.module.scss';
import LoanSummary from '@/components/borrower/LoanSummary';
import LoanDetailSlider from '@/components/borrower/LoanDetailSlider';
import Button from '@/components/common/Button';

const LoanSummarySection = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.left}>
          <LoanSummary limit={1250000000} rate={8.5} repayment={80} />
        </div>

        <div className={styles.right}>
          <LoanDetailSlider />
        </div>
      </div>

      <div className={styles.bottomButton}>
        <Button
          label={{ text: '대출하기', size: 'md', color: 'white' }}
          variant='filled'
          size='large'
        />
      </div>
    </section>
  );
};

export default LoanSummarySection;
