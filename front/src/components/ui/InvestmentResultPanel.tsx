'use client';

import React, { useState } from 'react';
import styles from '@/styles/uis/InvestmentResultPanel.module.scss';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';
import { Calculator } from 'lucide-react';
import InvestmentModal from './InvestmentModal';

interface InvestmentResultPanelProps {
  amount: number;
  rate: number;
  setAmount: (amount: number) => void;
  setRate: (rate: number) => void;
}

const InvestmentResultPanel: React.FC<InvestmentResultPanelProps> = ({
  amount,
  rate,
  setAmount,
  setRate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const interest = Math.floor(amount * (rate / 100));
  const total = amount + interest;

  return (
    <div className={styles.resultWrapper}>
      <div className={styles.iconWrapper}>
        <Calculator size={32} color='#145DA0' />
      </div>

      <Text
        text='예상 수익금액'
        size='sm'
        color='light-blue'
        weight='regular'
      />

      <Text
        text={`₩ ${total.toLocaleString()}`}
        size='text-3xl'
        color='blue'
        weight='bold'
      />

      <Text
        text={`원금 ₩${amount.toLocaleString()} + 이자 ₩${interest.toLocaleString()}`}
        size='md'
        color='gray'
        weight='regular'
      />

      <div style={{ marginTop: '2rem' }}>
        <Button
          label={{ text: '바로 투자하기', size: 'sm', color: 'blue' }}
          variant='outlined'
          size='normal'
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialAmount={amount}
        initialRate={rate}
        setAmount={setAmount}
        setRate={setRate}
      />
    </div>
  );
};

export default InvestmentResultPanel;
