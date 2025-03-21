import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import UserInfoCard from '@/components/common/UserInfoCard';

export default {
  title: 'common/UserInfoCard',
  component: UserInfoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: ['clock', 'triangleAlert'],
    },
    title: { control: 'object' },
    category: { control: 'object' },
    categoryValue: { control: 'object' },
    totalCount: { control: 'object' },
    changeRate: { control: 'object' },
  },
} as Meta<typeof UserInfoCard>;

const Template: StoryFn<typeof UserInfoCard> = (args) => (
  <UserInfoCard {...args} />
);

export const ClockCard = Template.bind({});
ClockCard.args = {
  icon: 'clock',
  title: { text: '최근 투자자 수', size: 'xs', color: 'gray' },
  category: { text: 'VIP', size: 'md', color: 'light-blue' },
  categoryValue: { text: '120명', size: 'md', color: 'light-blue' },
  totalCount: { text: '2000명', size: 'xs', color: 'gray' },
  changeRate: { text: '+5%', size: 'xs', color: 'text-ascendRed' },
};

export const AlertCard = Template.bind({});
AlertCard.args = {
  icon: 'triangleAlert',
  title: { text: '최근 경고 계정', size: 'xs', color: 'gray' },
  category: { text: '위험', size: 'md', color: 'light-blue' },
  categoryValue: { text: '5건', size: 'md', color: 'light-blue' },
  totalCount: { text: '50건', size: 'xs', color: 'gray' },
  changeRate: { text: '-2%', size: 'xs', color: 'text-descentBlue' },
};
