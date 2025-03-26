import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import BarChart from '@/components/chart/BarChart';
// import { BarChartProps } from '@/types/components';

export default {
  title: 'Charts/BarChart',
  component: BarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    labels: { control: 'object' },
    values: { control: 'object' },
    title: { control: 'text' },
  },
} as Meta<typeof BarChart>;

const Template: StoryFn<typeof BarChart> = (args) => <BarChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  labels: ['상환완료', '상환중', '투자중', '부실', '소유권 이전'],
  values: [5000000, 3000000, 2000000, 1000000, 500000],
  title: '투자 상태별 금액',
};
