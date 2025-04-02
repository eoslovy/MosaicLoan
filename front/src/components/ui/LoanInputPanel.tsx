'use client';

import React from 'react';
import styles from '@/styles/uis/InvestmentInputPanel.module.scss';
import Text from '@/components/common/Text';
import Slider from '@/components/common/Slider';

interface LoanInputPanelProps {
  amount: number;
  setAmount: (value: number) => void;
  rate: number;
  setRate: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
}

const LoanInputPanel = ({
  amount,
  setAmount,
  rate,
  setRate,
  duration,
  setDuration,
}: LoanInputPanelProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <div className={styles.labelWrapper}>
          <Text text='대출 금액' size='lg' weight='bold' color='primary-blue' />
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
              max={50000000}
              step={100000}
              labelLeft='10만원'
              labelRight='5천만원'
            />
          </div>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.labelWrapper}>
          <Text text='대출 기간' size='lg' weight='bold' color='primary-blue' />
          {/* <Text
            text={`${duration}개월`}
            size='xl'
            weight='bold'
            color='primary-blue'
          /> */}
        </div>
        <div className={styles.contentWrapper}>
          <Text
            text={`${duration} 개월`}
            size='text-3xl'
            weight='bold'
            color='primary-blue'
            className={styles.selectedValue}
          />
          <div className={styles.sliderWrapper}>
            <Slider
              value={duration}
              onChange={setDuration}
              min={1}
              max={36}
              step={1}
              labelLeft='1개월'
              labelRight='3년'
            />
          </div>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.labelWrapper}>
          <Text text='연 이자율' size='lg' weight='bold' color='primary-blue' />
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
              min={0}
              max={30}
              step={0.1}
              labelLeft='0%'
              labelRight='30%'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanInputPanel;
