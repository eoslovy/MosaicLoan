import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChartProps } from '@/types/components';
import type { TooltipItem } from 'chart.js';
import styles from '@/styles/charts/PieChart.module.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

// 기본 색상
const defaultColors = ['#6366F1', '#10B981', '#FACC15', '#EF4444', '#9CA3AF'];

const PieChart: React.FC<PieChartProps> = ({
  labels,
  data,
  colors = defaultColors,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label(tooltipItem: TooltipItem<'pie'>) {
            const value = tooltipItem.raw;
            const total = data.reduce((acc, val) => acc + val, 0);
            const percentage =
              typeof value === 'number' && total > 0
                ? ((value / total) * 100).toFixed(1)
                : '0';
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className={styles.pieChartContainer}>
      <div className={styles.pieChart}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
