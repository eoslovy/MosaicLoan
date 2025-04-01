'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProfitDistributionChartProps {
  data: number[];
  expectedRate: number;
}

const ProfitDistributionChart: React.FC<ProfitDistributionChartProps> = ({
  data,
  expectedRate,
}) => {
  // 데이터를 빈도수로 변환
  const frequencyData = data.reduce((acc: { [key: number]: number }, curr) => {
    const rounded = Math.round(curr * 100) / 100;
    acc[rounded] = (acc[rounded] || 0) + 1;
    return acc;
  }, {});

  // 차트 데이터 포맷팅
  const chartData = Object.entries(frequencyData)
    .map(([rate, count]) => ({
      rate: parseFloat(rate),
      count,
    }))
    .sort((a, b) => a.rate - b.rate);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='rate'
            tick={false}
            label={{
              value: '실제 수익률',
              position: 'insideBottom',
              offset: 10,
            }}
          />
          <YAxis
            label={{
              value: '사람 수',
              angle: -90,
              position: 'insideLeft',
              offset: 25,
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}명`, '인원']}
            labelFormatter={(label) => `${label}%`}
          />
          <Line
            type='monotone'
            dataKey='count'
            stroke='#145da0'
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitDistributionChart;
