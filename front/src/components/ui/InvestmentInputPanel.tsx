'use client';

import React from 'react';
import styles from '@/styles/uis/InvestmentInputPanel.module.scss';
import SliderGroupItem from '@/components/ui/SliderGroupItem';
import { InvestmentInputPanelProps } from '@/types/components';

const InvestmentInputPanel: React.FC<InvestmentInputPanelProps> = ({
  amount,
  setAmount,
  duration,
  setDuration,
  rate,
  setRate,
}) => {
  return (
    <div className={styles.panelWrapper}>
      <SliderGroupItem
        title="투자 금액"
        valueText={`₩${amount.toLocaleString()}`}
        sliderValue={amount}
        min={100000}
        max={50000000}
        step={100000}
        labelLeft="10만원"
        labelRight="5천만원"
        onChange={setAmount}
        bgColor="none"
      />

      <SliderGroupItem
        title="투자 기간"
        valueText={`${duration} 개월`}
        sliderValue={duration}
        min={1}
        max={36}
        step={1}
        labelLeft="1개월"
        labelRight="36개월"
        onChange={setDuration}
        bgColor="light-blue"
      />

      <SliderGroupItem
        title="기대 수익률"
        valueText={`${rate.toFixed(1)} %`}
        sliderValue={rate}
        min={1}
        max={15}
        step={0.1}
        labelLeft="1 %"
        labelRight="15 %"
        onChange={setRate}
        bgColor="none"
      />
    </div>
  );
};

export default InvestmentInputPanel;
