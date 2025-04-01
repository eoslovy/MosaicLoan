'use client';

import React from 'react';
import styles from '@/styles/borrowers/LoanSummary.module.scss';
import BasicCard from '@/components/common/BasicInfoCard';
// import { TrendingUp, Percent, ArrowUpRight } from 'lucide-react';

interface LoanSummaryProps {
  limit: number;
  rate: number;
  repayment: number;
}

const LoanSummary: React.FC<LoanSummaryProps> = ({
  limit,
  rate,
  repayment,
}) => {
  return (
    <div className={styles.wrapper}>
      <BasicCard
        icon='trendingUp'
        label='대출 한도'
        value={`₩${limit.toLocaleString()}`}
      />
      <BasicCard icon='percent' label='적용 금리' value={`${rate}%`} />
      <BasicCard icon='arrowUpRight' label='상환율' value={`${repayment}%`} />
    </div>
  );
};

export default LoanSummary;
