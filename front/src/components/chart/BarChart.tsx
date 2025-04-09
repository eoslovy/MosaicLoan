'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { BarChartProps } from '@/types/components';
import styles from '@/styles/charts/BarChart.module.scss';
import type { TooltipItem } from 'chart.js';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart: React.FC<BarChartProps> = ({ labels, values, title }) => {
  const maxValue = Math.max(...values); // 상태별 금액의 최대값

  const data = {
    labels,
    datasets: [
      {
        label: '거래 금액',
        data: values,
        backgroundColor: '#10B981', // 녹색으로 통일
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'bar'>) => {
            const { raw } = tooltipItem;
            if (typeof raw === 'number') {
              return ` ${raw.toLocaleString()} 원`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          padding: 10, // 패딩 증가
          font: {
            size: 11, // 폰트 크기 조정
            lineHeight: 1.2, // 줄 간격 설정
          },
          callback: (value: unknown, index: number) => {
            const label = labels[index];
            if (!label) return '';

            // 언더스코어로 구분된 라벨 처리
            if (label.includes('_')) {
              // 언더스코어를 기준으로 분리하고 각 부분을 짧게 만든 후 줄바꿈으로 결합
              const parts = label.split('_');
              if (parts.length > 1) {
                return parts
                  .map((part) =>
                    part.length > 5 ? `${part.substring(0, 5)}.` : part,
                  )
                  .join('\n');
              }
            }

            // 일반 라벨 처리
            if (label.length > 8) {
              return `${label.substring(0, 7)}.`;
            }

            return label;
          },
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: maxValue * 1.1, // Y축 최대값을 상태별 금액의 최대값으로 설정 (10% 여유 추가)
        ticks: {
          callback: (tickValue: string | number) => {
            if (typeof tickValue !== 'number') return tickValue;

            if (tickValue >= 1_000_000_000)
              return `${tickValue / 1_000_000_000}억`;
            if (tickValue >= 10_000_000) return `${tickValue / 10_000_000}천만`;
            if (tickValue >= 1_000_000) return `${tickValue / 1_000_000}백만`;
            if (tickValue >= 100_000) return `${tickValue / 100_000}십만`;
            return `${tickValue.toLocaleString()} 원`;
          },
        },
      },
    },
  };

  return (
    <div className={styles.barChartContainer}>
      <div className={styles.chartWrapper}>
        <Bar data={data} options={options} />
      </div>

      {title && <h3 className={styles.chartTitle}>{title}</h3>}
    </div>
  );
};

export default BarChart;
