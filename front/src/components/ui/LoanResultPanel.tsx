'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/uis/InvestmentResultPanel.module.scss';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';
import { Calculator } from 'lucide-react';

interface LoanResultPanelProps {
  amount: number;
  rate: number;
  duration: number;
}

const LoanResultPanel: React.FC<LoanResultPanelProps> = ({
  amount,
  rate,
  duration,
}) => {
  const router = useRouter();

  // 월 이자율 계산
  const monthlyRate = rate / 12 / 100;

  // 원리금균등상환 방식으로 월 상환금액 계산
  const monthlyPayment = Math.floor(
    (amount * monthlyRate * (1 + monthlyRate) ** duration) /
      ((1 + monthlyRate) ** duration - 1),
  );

  // 총 이자 계산
  const totalInterest = monthlyPayment * duration - amount;
  // 전체 상환금액
  const totalPayment = amount + totalInterest;

  const handleLoanClick = () => {
    router.push('/borrower');
  };

  return (
    <div className={styles.resultWrapper}>
      <div className={styles.iconWrapper}>
        <Calculator size={32} color='#145DA0' />
      </div>

      <Text
        text='전체 상환금액'
        size='sm'
        color='light-blue'
        weight='regular'
      />

      <Text
        text={`₩ ${totalPayment.toLocaleString()}`}
        size='text-3xl'
        color='blue'
        weight='bold'
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        <Text
          text='월 상환금액'
          size='sm'
          color='light-blue'
          weight='regular'
        />

        <Text
          text={`₩ ${monthlyPayment.toLocaleString()}`}
          size='md'
          color='light-blue'
          weight='regular'
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        <Text text='상환 내역' size='sm' color='light-blue' weight='regular' />
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
        >
          <Text
            text={`원금: ₩${amount.toLocaleString()}`}
            size='md'
            color='gray'
            weight='regular'
          />
          <Text
            text={`이자: ₩${totalInterest.toLocaleString()}`}
            size='md'
            color='gray'
            weight='regular'
          />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Button
          label={{ text: '대출하러가기', size: 'sm', color: 'blue' }}
          variant='outlined'
          size='normal'
          onClick={handleLoanClick}
        />
      </div>
    </div>
  );
};

export default LoanResultPanel;
