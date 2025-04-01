'use client';

import React, { useState } from 'react';
import styles from '@/styles/uis/InvestmentCalculator.module.scss';
import InvestmentInputPanel from './InvestmentInputPanel';
import InvestmentResultPanel from './InvestmentResultPanel';
import LoanInputPanel from './LoanInputPanel';
import LoanResultPanel from './LoanResultPanel';

type CalculatorType = 'investment' | 'loan';

const InvestmentCalculator = () => {
  const [calculatorType, setCalculatorType] =
    useState<CalculatorType>('investment');
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(8.8);
  const [duration, setDuration] = useState(12);

  const handleTabClick = (type: CalculatorType) => {
    setCalculatorType(type);
  };

  return (
    <section className={styles.calculatorWrapper}>
      <div className={styles.tabButtons}>
        <button
          type='button'
          className={`${styles.tabButton} ${calculatorType === 'investment' ? styles.active : ''}`}
          onClick={() => handleTabClick('investment')}
        >
          투자 계산기
        </button>
        <button
          type='button'
          className={`${styles.tabButton} ${calculatorType === 'loan' ? styles.active : ''}`}
          onClick={() => handleTabClick('loan')}
        >
          대출 계산기
        </button>
      </div>

      <div className={styles.calculatorBody}>
        {calculatorType === 'investment' ? (
          <>
            <div className={styles.leftPanel}>
              <InvestmentInputPanel
                amount={amount}
                setAmount={setAmount}
                rate={rate}
                setRate={setRate}
                minRate={8}
                maxRate={15}
                step={0.1}
              />
            </div>

            <div className={styles.rightPanel}>
              <InvestmentResultPanel
                amount={amount}
                rate={rate}
                setAmount={setAmount}
                setRate={setRate}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.leftPanel}>
              <LoanInputPanel
                amount={amount}
                setAmount={setAmount}
                rate={rate}
                setRate={setRate}
                duration={duration}
                setDuration={setDuration}
              />
            </div>

            <div className={styles.rightPanel}>
              <LoanResultPanel
                amount={amount}
                rate={rate}
                duration={duration}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default InvestmentCalculator;
