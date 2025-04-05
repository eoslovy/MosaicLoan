'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/LoanDetailSlider.module.scss';
import Text from '@/components/common/Text';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  recentLoans: {
    dueDate: string;
    principal: number;
    interest: number;
    amount: number;
  }[];
}

const LoanDetailSlider = ({ recentLoans }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentLoan = recentLoans[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : recentLoans.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < recentLoans.length - 1 ? prev + 1 : 0));
  };

  // 날짜 차이 계산
  const getDDay = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 일 수
  };

  return (
    <div className={styles.sliderWrapper}>
      <Text
        text={`진행중인 대출 (${recentLoans.length}건)`}
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
                <span className={styles.badge}>
                  D-{getDDay(currentLoan.dueDate)}
                </span>
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
              <td colSpan={2}>
                {(
                  currentLoan.principal + currentLoan.interest
                ).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
        <ChevronRight className={styles.arrow} onClick={handleNext} />
      </div>
    </div>
  );
};

export default LoanDetailSlider;
