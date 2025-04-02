'use client';

import React from 'react';
import styles from '@/styles/uis/InvestmentInputPanel.module.scss';
import Text from '@/components/common/Text';
import Slider from '@/components/common/Slider';

interface InvestmentInputPanelProps {
  amount: number;
  setAmount: (value: number) => void;
  rate: number;
  setRate: (value: number) => void;
  duration?: number;
  setDuration?: (value: number) => void;
  minRate?: number;
  maxRate?: number;
  step?: number;
}

const InvestmentInputPanel = ({
  amount,
  setAmount,
  rate,
  setRate,
  duration,
  setDuration,
  minRate,
  maxRate,
  step,
}: InvestmentInputPanelProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <div className={styles.labelWrapper}>
          <Text text='투자 금액' size='lg' weight='bold' color='primary-blue' />
          {/* <Text
            text={`${amount.toLocaleString()}원`}
            size='xl'
            weight='bold'
            color='primary-blue'
          /> */}
        </div>
        <div className={styles.contentWrapper}>
          <Text
            text={`₩ ${formatCurrency(amount)}`}
            size='text-3xl'
            weight='bold'
            color='primary-blue'
            className={styles.selectedValue}
          />
          <div className={styles.sliderWrapper}>
            <Slider
              value={amount}
              onChange={setAmount}
              min={100000}
              max={5000000}
              step={100000}
              labelLeft='10만원'
              labelRight='5천만원'
            />
          </div>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.labelWrapper}>
          <Text
            text='기대 수익률'
            size='lg'
            weight='bold'
            color='primary-blue'
          />
          {/* <Text
            text={`${rate}%`}
            size='xl'
            weight='bold'
            color='primary-blue'
          /> */}
        </div>
        <div className={styles.contentWrapper}>
          <Text
            text={`${rate} %`}
            size='text-3xl'
            weight='bold'
            color='primary-blue'
            className={styles.selectedValue}
          />
          <div className={styles.sliderWrapper}>
            <Slider
              value={rate}
              onChange={setRate}
              min={minRate ?? 0}
              max={maxRate ?? 30}
              step={step ?? 1}
              labelLeft={`${minRate ?? 0}%`}
              labelRight={`${maxRate ?? 30}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

InvestmentInputPanel.defaultProps = {
  minRate: 0,
  maxRate: 30,
  step: 1,
  duration: 12,
  setDuration: () => {},
} as Partial<InvestmentInputPanelProps>;

export default InvestmentInputPanel;
