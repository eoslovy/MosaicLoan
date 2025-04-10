'use client';

import React, { useRef, useEffect } from 'react';
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
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // 차트가 렌더링된 후 컨테이너에 이벤트 리스너 추가
  useEffect(() => {
    const container = chartContainerRef.current;

    if (container) {
      // 클릭 이벤트를 완전히 차단하는 핸들러
      const blockClickHandler = (e: MouseEvent): boolean => {
        e.preventDefault();
        e.stopPropagation();
        return false; // 명시적으로 boolean 반환
      };

      // 컨테이너에 이벤트 리스너 추가
      container.addEventListener('click', blockClickHandler, true);

      // 클린업 함수
      return () => {
        container.removeEventListener('click', blockClickHandler, true);
      };
    }
    // useEffect의 빈 반환을 명시적으로 추가
    return undefined;
  }, []);

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
    fontSize: 14, // 글자 크기 증가
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }}>
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
