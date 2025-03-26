import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import ChartInfoCard from '@/components/common/ChartInfoCard';
// import { ChartInfoCardProps } from '@/types/components';

export default {
  title: 'common/ChartInfoCard',
  component: ChartInfoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartInfoCard>;

const Template: StoryFn<typeof ChartInfoCard> = (args) => (
  <ChartInfoCard {...args} />
);

// 상환 완료율 예제
export const RepaymentCompleted = Template.bind({});
RepaymentCompleted.args = {
  title: { text: '상환 완료율', size: 'xs', color: 'gray' },
  category: { text: '상환 완료', size: 'md', color: 'light-blue' },
  categoryCount: { text: '85', size: 'xs', color: 'gray' },
  totalCount: { text: '100', size: 'xs', color: 'gray' },
  changeValue: { text: '+5%', size: 'xs', color: 'text-ascendRed' },
};

// 투자중 채권 비율 예제
export const InvestingRatio = Template.bind({});
InvestingRatio.args = {
  title: { text: '투자중 채권 비율', size: 'xs', color: 'gray' },
  category: { text: '투자 중', size: 'md', color: 'light-blue' },
  categoryCount: { text: '60', size: 'xs', color: 'gray' },
  totalCount: { text: '100', size: 'xs', color: 'gray' },
  changeValue: { text: '-3%', size: 'xs', color: 'text-descentBlue' },
};

// 연체율 예제
export const LoanDefault = Template.bind({});
LoanDefault.args = {
  title: { text: '연체율', size: 'xs', color: 'gray' },
  category: { text: '연체', size: 'md', color: 'light-blue' },
  categoryCount: { text: '5', size: 'xs', color: 'gray' },
  totalCount: { text: '100', size: 'xs', color: 'gray' },
  changeValue: { text: '+1%', size: 'xs', color: 'text-ascendRed' },
};

// 값이 999+로 변환되는 테스트 예제
export const LargeValues = Template.bind({});
LargeValues.args = {
  title: { text: '상환 완료율', size: 'xs', color: 'gray' },
  category: { text: '상환 완료', size: 'md', color: 'light-blue' },
  categoryCount: { text: '1200', size: 'xs', color: 'gray' }, // ✅ 999+로 변환
  totalCount: { text: '1500', size: 'xs', color: 'gray' }, // ✅ 999+로 변환
  changeValue: { text: '+12%', size: 'xs', color: 'text-ascendRed' },
};

// 투자 비율이 매우 낮은 경우
export const LowInvestmentRate = Template.bind({});
LowInvestmentRate.args = {
  title: { text: '투자중 채권 비율', size: 'xs', color: 'gray' },
  category: { text: '투자 중', size: 'md', color: 'light-blue' },
  categoryCount: { text: '10', size: 'xs', color: 'gray' },
  totalCount: { text: '100', size: 'xs', color: 'gray' },
  changeValue: { text: '-15%', size: 'xs', color: 'text-descentBlue' },
};

// 투자 비율이 매우 높은 경우
export const HighInvestmentRate = Template.bind({});
HighInvestmentRate.args = {
  title: { text: '투자중 채권 비율', size: 'xs', color: 'gray' },
  category: { text: '투자 중', size: 'md', color: 'light-blue' },
  categoryCount: { text: '98', size: 'xs', color: 'gray' },
  totalCount: { text: '100', size: 'xs', color: 'gray' },
  changeValue: { text: '+7%', size: 'xs', color: 'text-ascendRed' },
};
