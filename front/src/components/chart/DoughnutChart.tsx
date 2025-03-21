import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { DoughnutChartProps, DoughnutChartType } from '@/types/components';
import styles from '@/styles/charts/DoughnutChart.module.scss';

ChartJS.register(ArcElement, Tooltip);

const chartColors: Record<DoughnutChartType, string> = {
  'repay-complete': '#10B981',
  investing: '#6366F1',
};

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  percentage,
  type,
  label,
}) => {
  const color = chartColors[type] || '#9CA3AF';

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className={styles.doughnutChart}>
      <Doughnut data={data} options={options} />
      <div className={styles.centerText}>
        {percentage}%{label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
};

export default DoughnutChart;
