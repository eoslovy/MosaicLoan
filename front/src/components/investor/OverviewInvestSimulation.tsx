'use client';

import React, { useState } from 'react';
import styles from '@/styles/investors/OverviewInvestSimulation.module.scss';
import InvestmentInputPanel from '@/components/ui/InvestmentInputPanel';
import InvestmentResultPanel from '@/components/ui/InvestmentResultPanel';
import Text from '@/components/common/Text';

const OverviewInvestSimulation = () => {
  const [amount, setAmount] = useState(1000000); // 100만 원
  const [duration, setDuration] = useState(12); // 12개월
  const [rate, setRate] = useState(8.8); // 8.8%

  return (
    <div className={styles.section}>
      <Text
        text='투자 시뮬레이션'
        size='text-3xl'
        color='primary-blue'
        weight='bold'
        className={styles.title}
      />

      <div className={styles.wrapper}>
        {/* 좌측 슬라이드 패널 */}
        <div className={styles.left}>
          <InvestmentInputPanel
            amount={amount}
            setAmount={setAmount}
            duration={duration}
            setDuration={setDuration}
            rate={rate}
            setRate={setRate}
          />
        </div>

        {/* 우측 수익 결과 패널 */}
        <div className={styles.right}>
          <InvestmentResultPanel
            amount={amount}
            duration={duration}
            rate={rate}
          />

          {/* TODO: 여기에 차트 들어갈 영역 구성 예정 */}
          <div className={styles.chartPlaceholder}>
            <p>차트 들어갈 자리</p>
          </div>
        </div>
      </div>

      {/* 하단 투자 버튼 */}
      <div className={styles.buttonWrapper}>
        <button type='button' className={styles.investButton}>
          투자하기
        </button>
      </div>
    </div>
  );
};

export default OverviewInvestSimulation;
