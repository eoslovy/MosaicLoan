import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import BarLineChart from '@/components/chart/BarLineChart';
import { DateUnit } from '@/types/components';

export default {
  title: 'Charts/BarLineChart',
  component: BarLineChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BarLineChart>;

const Template: StoryFn<typeof BarLineChart> = (args) => {
  const [dateUnit, setDateUnit] = useState<DateUnit>('day');
  const [displayCount, setDisplayCount] = useState(10);

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        {['day', 'week', 'month'].map((unit) => (
          <button
            key={unit}
            onClick={() => setDateUnit(unit as DateUnit)}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: dateUnit === unit ? '#6366F1' : '#E5E7EB',
              color: dateUnit === unit ? 'white' : 'black',
              border: 'none',
            }}
            type='button'
          >
            {unit.toUpperCase()}
          </button>
        ))}
      </div>
      <input
        type='number'
        value={displayCount}
        onChange={(e) => setDisplayCount(Number(e.target.value))}
        placeholder='표시할 데이터 개수'
      />
      <BarLineChart {...args} dateUnit={dateUnit} displayCount={displayCount} />
    </div>
  );
};

export const Default = Template.bind({});
const getLineValue = (i: number) => {
  if (i < 30) return Math.floor(Math.random() * 400 + 500);
  if (i < 60) return Math.floor(Math.random() * 500 + 400);
  return Math.floor(Math.random() * 600 + 300);
};
Default.args = {
  labels: Array.from({ length: 90 }, (_, i) => `01-${(i % 30) + 1}`),
  rawBarData: {
    상환완료: Array.from({ length: 90 }, () =>
      Math.floor(Math.random() * 150 + 50),
    ), // 50~200 사이 값
    상환중: Array.from({ length: 90 }, () =>
      Math.floor(Math.random() * 100 + 20),
    ), // 20~120 사이 값
    투자중: Array.from({ length: 90 }, () =>
      Math.floor(Math.random() * 80 + 10),
    ), // 10~90 사이 값
    부실: Array.from({ length: 90 }, () => Math.floor(Math.random() * 50 + 5)), // 5~55 사이 값
    '소유권 이전': Array.from({ length: 90 }, () =>
      Math.floor(Math.random() * 40),
    ), // 0~40 사이 값
  },
  rawLineData: Array.from({ length: 90 }, (_, i) => getLineValue(i)),
  barCategories: ['상환완료', '상환중', '투자중', '부실', '소유권 이전'],
  displayCount: 10,
};
