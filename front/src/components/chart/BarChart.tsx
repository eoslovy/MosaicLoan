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
        label: '상태별 금액',
        data: values,
        backgroundColor: [
          '#10B981',
          '#6366F1',
          '#F59E0B',
          '#EF4444',
          '#9CA3AF',
        ],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 범례 제거
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
          display: false, // X축 격자 제거
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
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <div className={styles.chartWrapper}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
