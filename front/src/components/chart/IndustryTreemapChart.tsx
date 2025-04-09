'use client';

import React from 'react';
import { Chart } from 'react-google-charts';

export interface IndustryRatio {
  industry: string;
  ratio: number;
}

interface IndustryTreemapChartProps {
  data: IndustryRatio[];
}

const IndustryTreemapChart: React.FC<IndustryTreemapChartProps> = ({
  data,
}) => {
  const chartData = [
    ['Industry', 'Parent', 'Ratio'],
    ['전체', null, 0],
    ...data.map((item) => [item.industry, '전체', item.ratio]),
  ];

  const options = {
    minColor: '#bbdefb', // 더 연한 밝은 파란색
    midColor: '#42a5f5', // 중간 톤의 파란색
    maxColor: '#1565c0', // 진한 파란색 유지
    headerHeight: 0,
    fontColor: 'white',
    showScale: false,
    useWeightedAverageForAggregation: true,
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Chart
        chartType='TreeMap'
        data={chartData}
        options={options}
        width='100%'
        height='100%'
      />
    </div>
  );
};

export default IndustryTreemapChart;
