import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import ServiceInfoCard from '@/components/common/ServiceInfoCard';

export default {
  title: 'common/ServiceInfoCard',
  component: ServiceInfoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'radio',
      options: ['shield', 'users', 'trendingUp', 'clock'],
    },
  },
} as Meta<typeof ServiceInfoCard>;

const Template: StoryFn<typeof ServiceInfoCard> = (args) => (
  <ServiceInfoCard {...args} />
);

export const ShieldCard = Template.bind({});
ShieldCard.args = {
  icon: 'shield',
  value: '안전한 투자',
  label:
    '철저한 심사와 다양한 보호 장치로\n투자자의 자산을 안전하게 보호합니다.',
};

export const UsersCard = Template.bind({});
UsersCard.args = {
  icon: 'users',
  value: '맞춤형 대출',
  label: '개인의 신용과 상황에 맞는\n최적의 대출 조건을 제공합니다.',
};

export const TrendingUpCard = Template.bind({});
TrendingUpCard.args = {
  icon: 'trendingUp',
  value: '높은 수익률',
  label: '은행 대비 높은 금리로\n효율적인 자산 증식이 가능합니다.',
};

export const ClockCard = Template.bind({});
ClockCard.args = {
  icon: 'clock',
  value: '빠른 심사',
  label: 'AI 기반 심사 시스템으로 신속한\n대출 심사와 승인이 이루어집니다.',
};
