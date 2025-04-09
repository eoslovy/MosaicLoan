'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/investors/OverviewInvestSimulation.module.scss';
import InvestmentInputPanel from '@/components/ui/InvestmentInputPanel';
import ProfitDistributionChart from '@/components/ui/ProfitDistributionChart';
import Text from '@/components/common/Text';
import InvestmentModal from '@/components/ui/InvestmentModal';

// 목데이터 생성 함수
const generateMockData = (mean: number, stdDev: number, count: number) => {
  const data: number[] = [];
  for (let i = 0; i < count; i += 1) {
    // Box-Muller 변환을 사용한 정규 분포 난수 생성
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const value = mean + z * stdDev;
    data.push(value);
  }
  return data;
};

const OverviewInvestSimulation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(8.8);
  const [simulationData, setSimulationData] = useState<number[]>([]);

  useEffect(() => {
    // 선택된 수익률을 평균으로 하고, 표준편차 2%인 정규분포 데이터 생성
    const data = generateMockData(rate, 2, 2500);
    setSimulationData(data);
  }, [rate]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.titleWrapper}>
        <Text
          text='투자 시뮬레이션'
          size='text-3xl'
          color='primary-blue'
          weight='bold'
          className={styles.title}
        />
      </div>

      <div className={styles.wrapper}>
        {/* 좌측 슬라이드 패널 */}
        <div className={styles.left}>
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

        {/* 우측 수익 결과 패널 */}
        <div className={styles.right}>
          <div className={styles.resultWrapper}>
            <Text
              text='예상 수익금액'
              size='xl'
              weight='bold'
              className={styles.resultTitle}
            />
            <Text
              text={`₩ ${new Intl.NumberFormat('ko-KR').format(Math.round(amount * (1 + rate / 100)))}`}
              size='text-3xl'
              weight='bold'
              color='primary-blue'
              className={styles.resultAmount}
            />
            <div className={styles.resultDetail}>
              <Text
                text={`원금 ₩ ${new Intl.NumberFormat('ko-KR').format(amount)} + 이자 ₩ ${new Intl.NumberFormat('ko-KR').format(Math.round(amount * (rate / 100)))}`}
                size='md'
                color='gray'
              />
              <Text text={`예상 채권 수 = ${2500} 개`} size='md' color='gray' />
            </div>

            {/* 수익률 분포 차트 */}
            <div className={styles.chartContainer}>
              <Text
                text={`${rate}% 기대수익률 선택자의 실제 수익률 분포`}
                size='lg'
                weight='bold'
                className={styles.chartTitle}
              />
              <ProfitDistributionChart
                data={simulationData}
                expectedRate={rate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 투자 버튼 */}
      <div className={styles.buttonWrapper}>
        <button
          type='button'
          className={styles.investButton}
          onClick={handleOpenModal}
        >
          투자하기
        </button>
      </div>

      <InvestmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialAmount={amount}
        initialRate={rate}
      />
    </div>
  );
};

export default OverviewInvestSimulation;
