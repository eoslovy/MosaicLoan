'use client';

import React, { useState } from 'react';
import styles from '@/styles/uis/InvestmentCalculator.module.scss';
import InvestmentInputPanel from './InvestmentInputPanel';
import InvestmentResultPanel from './InvestmentResultPanel';

const InvestmentCalculator = () => {
  const [amount, setAmount] = useState(1000000);
  const [duration, setDuration] = useState(12);
  const [rate, setRate] = useState(8.8);

  return (
    <section className={styles.calculatorWrapper}>
      <div className={styles.tabButtons}>
        <button className={`${styles.tabButton} ${styles.active}`}>투자 계산기</button>
        <button className={styles.tabButton}>대출 계산기</button>
      </div>

      <div className={styles.calculatorBody}>
        <div className={styles.leftPanel}>
          <InvestmentInputPanel
            amount={amount}
            setAmount={setAmount}
            duration={duration}
            setDuration={setDuration}
            rate={rate}
            setRate={setRate}
          />
        </div>

        <div className={styles.rightPanel}>
          <InvestmentResultPanel amount={amount} duration={duration} rate={rate} />
        </div>
      </div>
    </section>
  );
};

export default InvestmentCalculator;
