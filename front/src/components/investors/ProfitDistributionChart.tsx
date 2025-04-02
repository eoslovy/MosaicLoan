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
  data: Array<{
    month: number;
    profit: number;
  }>;
}

const ProfitDistributionChart: React.FC<ProfitDistributionChartProps> = ({
  data,
}) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='month'
            label={{ value: '개월', position: 'bottom' }}
          />
          <YAxis
            label={{
              value: '수익 (원)',
              angle: -90,
              position: 'insideLeft',
            }}
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
          />
          <Tooltip
            formatter={(value: number) => [
              `${value.toLocaleString()}원`,
              '수익',
            ]}
            labelFormatter={(label) => `${label}개월`}
          />
          <Line
            type='monotone'
            dataKey='profit'
            stroke='#2563eb'
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitDistributionChart;
