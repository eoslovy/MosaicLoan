import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import type { TooltipItem } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { BarLineChartProps, DateUnit } from '@/types/components';
import styles from '@/styles/charts/BarLineChart.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

const aggregateData = (labels: string[], data: number[], unit: DateUnit) => {
  const grouped: { [key: string]: number } = {};
  labels.forEach((date, index) => {
    let key = date;

    if (unit === 'week') key = `Week ${Math.ceil((index + 1) / 7)}`;
    else if (unit === 'month') key = `Month ${Math.ceil((index + 1) / 30)}`;

    grouped[key] = (grouped[key] || 0) + data[index];
  });

  return Object.keys(grouped).map((key) => ({
    label: key,
    value: grouped[key],
  }));
};

const BarLineChart: React.FC<BarLineChartProps> = ({
  labels,
  rawBarData,
  rawLineData,
  dateUnit = 'day',
  displayCount = 10,
  barCategories,
  // barLabel = '투자 상태별 금액',
  lineLabel = '투자금 잔액',
  barColors = ['#10B981', '#6366F1', '#FACC15', '#EF4444', '#9CA3AF'],
  lineColor = '#EF4444',
}) => {
  const processedBarData = useMemo(() => {
    return barCategories.map((category) => ({
      category,
      data: aggregateData(labels, rawBarData[category] || [], dateUnit),
    }));
  }, [labels, rawBarData, dateUnit, barCategories]);

  const processedLineData = useMemo(() => {
    return aggregateData(labels, rawLineData, dateUnit);
  }, [labels, rawLineData, dateUnit]);

  const slicedLabels = processedLineData
    .slice(-displayCount)
    .map((d) => d.label);
  const slicedBarData = processedBarData.map((categoryData, index) => ({
    ...categoryData,
    data: categoryData.data.slice(-displayCount),
    color: barColors[index % barColors.length],
  }));

  const slicedLineData = processedLineData
    .slice(-displayCount)
    .map((d) => d.value);

  // Chart.js 데이터 변환
  const data = {
    labels: slicedLabels,
    datasets: [
      ...slicedBarData.map((category) => ({
        type: 'bar' as const,
        label: category.category,
        data: category.data.map((d) => d.value),
        backgroundColor: category.color,
        borderRadius: 4,
        stack: 'Stack 1',
      })),
      {
        type: 'line' as const,
        label: lineLabel,
        data: slicedLineData,
        borderColor: lineColor,
        backgroundColor: lineColor,
        fill: false,
        pointRadius: 5,
        tension: 0.4,
        borderWidth: 2,
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: (tooltipItems: TooltipItem<'bar' | 'line'>[]) =>
            tooltipItems[0].label,
          label: (tooltipItem: TooltipItem<'bar' | 'line'>) => {
            const { datasetIndex } = tooltipItem;
            const dataset = data.datasets[datasetIndex];

            // bar 타입인 경우
            if (dataset.type === 'bar') {
              const datasetValues = dataset.data as number[];
              const totalValue = datasetValues.reduce(
                (sum, val) => sum + val,
                0,
              );
              const value = datasetValues[tooltipItem.dataIndex];
              const percentage =
                totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : '0';
              return `${dataset.label}: ${value.toLocaleString()} (${percentage}%)`;
            }

            // line 타입인 경우
            if (dataset.type === 'line') {
              const { raw } = tooltipItem;
              if (typeof raw === 'number') {
                return `${dataset.label}: ${raw.toLocaleString()} 원`;
              }
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
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return (
    <div className={styles.barLineChartWrapper}>
      <div className={styles.barLineChartContainer}>
        <div className={styles.barLineChart}>
          <Chart type='bar' data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BarLineChart;
