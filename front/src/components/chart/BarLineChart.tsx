'use client';

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
  lineLabel = '비율 (%)',
  barColors = ['#1e88e5'],
  lineColor = ['#ffc70e'],
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
      // 선 그래프를 먼저 배치하고 order를 0으로 설정
      {
        type: 'line' as const,
        label: lineLabel,
        data: slicedLineData,
        borderColor: lineColor,
        backgroundColor: lineColor,
        fill: false,
        pointRadius: 4,
        tension: 0.3,
        borderWidth: 2,
        order: 0, // 선 그래프가 앞에 표시되도록 설정
        zIndex: 10, // 높은 zIndex 설정
        yAxisID: 'y1', // 오른쪽 y축 사용
      },
      // 막대 그래프
      ...slicedBarData.map((category) => ({
        type: 'bar' as const,
        label: category.category,
        data: category.data.map((d) => d.value),
        backgroundColor: category.color, // 카테고리별 색상 적용
        borderRadius: 4,
        stack: 'Stack 1',
        order: 1,
        yAxisID: 'y', // 왼쪽 y축 사용
      })),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'center' as const,
        margin: 25,
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
                return `${dataset.label}: ${raw.toLocaleString()}%`;
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
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          padding: 5,
          font: {
            size: 1,
          },
          callback: (value: unknown, index: number) => {
            const label = slicedLabels[index];
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
        position: 'left' as const,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y1: {
        position: 'right' as const,
        beginAtZero: true,
        min: 0,
        max: 100, // 비율은 0-100%로 고정
        grid: {
          display: false, // 두 번째 축의 그리드 라인 숨김
        },
        ticks: {
          callback: (value: unknown) => `${value}%`,
          font: {
            size: 11,
          },
        },
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
