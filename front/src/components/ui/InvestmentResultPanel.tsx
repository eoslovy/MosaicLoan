'use client';

import React from 'react';
import styles from '@/styles/uis/InvestmentResultPanel.module.scss';
import Text from '@/components/common/Text';
import { Calculator } from 'lucide-react';
import { InvestmentResultPanelProps } from '@/types/components';

const InvestmentResultPanel: React.FC<InvestmentResultPanelProps> = ({
  amount,
  duration,
  rate,
}) => {
  const interest = Math.floor((amount * (rate / 100) * duration) / 12);
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
    </div>
  );
};

export default InvestmentResultPanel;
