import React, { useState, useEffect } from 'react';
import styles from '@/styles/investors/OverviewInvestSimulation.module.scss';
import Text from '@/components/common/Text';
import InvestmentInputPanel from '@/components/ui/InvestmentInputPanel';
import ProfitDistributionChart from './ProfitDistributionChart';

interface SimulationData {
  summary: {
    totalInvestment: number;
    totalProfit: number;
    profitRate: number;
  };
  details: Array<{
    month: number;
    investment: number;
    profit: number;
    profitRate: number;
  }>;
  profitHistory: Array<{
    month: number;
    profit: number;
  }>;
}

const OverviewInvestSimulation: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000000);
  const [duration, setDuration] = useState<number>(12);
  const [rate, setRate] = useState<number>(15);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimulationData = async () => {
      try {
        const response = await fetch('/investment/simulation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            investmentAmount: amount,
            duration,
            expectedReturn: rate,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch simulation data');
        }

        const data = await response.json();
        setSimulationData(data);
        setError(null);
      } catch (err) {
        setError('시뮬레이션 데이터를 불러오는데 실패했습니다.');
        setSimulationData(null);
      }
    };

    fetchSimulationData();
  }, [amount, duration, rate]);

  return (
    <div className={styles.container}>
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
      <div className={styles.right}>
        {error ? (
          <div className={styles.error}>
            <Text
              text={error}
              size='lg'
              weight='medium'
              color='text-ascendRed'
            />
          </div>
        ) : simulationData ? (
          <div className={styles.resultWrapper}>
            <div className={styles.summary}>
              <Text
                text='투자 시뮬레이션 결과'
                size='xl'
                weight='bold'
                color='primary-blue'
              />
              <div className={styles.summaryDetails}>
                <div className={styles.summaryItem}>
                  <Text text='총 투자금액' size='lg' weight='medium' />
                  <Text
                    text={`${simulationData.summary.totalInvestment.toLocaleString()}원`}
                    size='lg'
                    weight='bold'
                  />
                </div>
                <div className={styles.summaryItem}>
                  <Text text='총 수익금액' size='lg' weight='medium' />
                  <Text
                    text={`${simulationData.summary.totalProfit.toLocaleString()}원`}
                    size='lg'
                    weight='bold'
                  />
                </div>
                <div className={styles.summaryItem}>
                  <Text text='수익률' size='lg' weight='medium' />
                  <Text
                    text={`${simulationData.summary.profitRate.toFixed(2)}%`}
                    size='lg'
                    weight='bold'
                  />
                </div>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <ProfitDistributionChart data={simulationData.profitHistory} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OverviewInvestSimulation;
