'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/LoanDetailSlider.module.scss';
import Text from '@/components/common/Text';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const loanItems = [
  {
    dueDate: '2025-03-08',
    principal: 15000000,
    interest: 10000000,
    total: 25000000,
    dDay: 600,
  },
  {
    dueDate: '2025-05-10',
    principal: 12000000,
    interest: 9000000,
    total: 21000000,
    dDay: 450,
  },
  {
    dueDate: '2025-07-15',
    principal: 18000000,
    interest: 11000000,
    total: 29000000,
    dDay: 320,
  },
];

const LoanDetailSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentLoan = loanItems[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : loanItems.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < loanItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.sliderWrapper}>
      <Text
        text={`진행중인 대출 (${loanItems.length}건)`}
        size='lg'
        weight='bold'
        color='primary-blue'
      />

      <div className={styles.tableWrapper}>
        <ChevronLeft className={styles.arrow} onClick={handlePrev} />

        <table className={styles.table}>
          <tbody>
            <tr>
              <td>상환 예정일</td>
              <td colSpan={2}>
                {currentLoan.dueDate}
                <span className={styles.badge}>D-{currentLoan.dDay}</span>
              </td>
            </tr>
            <tr>
              <td>원금</td>
              <td colSpan={2}>{currentLoan.principal.toLocaleString()}</td>
            </tr>
            <tr>
              <td>이자</td>
              <td colSpan={2}>{currentLoan.interest.toLocaleString()}</td>
            </tr>
            <tr>
              <td>총 상환액</td>
              <td colSpan={2}>{currentLoan.total.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <ChevronRight className={styles.arrow} onClick={handleNext} />
      </div>
    </div>
  );
};

export default LoanDetailSlider;
