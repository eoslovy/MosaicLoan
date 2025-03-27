'use client';

import type { Meta, StoryObj } from '@storybook/react';
import SectionTabNav from '@/components/layout/SectionTabNav';
import { TextProps, TextSize, TextColor } from '@/types/components';

const meta: Meta<typeof SectionTabNav> = {
  title: 'Layout/SectionTabNav',
  component: SectionTabNav,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SectionTabNav>;

const title: TextProps = {
  text: '투자하기',
  size: 'text-3xl',
  color: 'primary-blue',
  weight: 'bold',
};

const description: TextProps = {
  text: '다양한 상품에 분산 투자하여 더 나은 수익을 기대해보세요.',
  size: 'md',
  color: 'gray',
  weight: 'regular',
};

const tabs = [
  {
    label: {
      text: '개요',
      size: 'sm' satisfies TextSize,
      color: 'gray' satisfies TextColor,
    },
    href: '/invest/products',
  },
  {
    label: {
      text: '채권 거래 내역',
      size: 'sm',
      color: 'gray',
    },
    href: '/invest/history',
  },
  {
    label: {
      text: '채권 통계',
      size: 'sm',
      color: 'gray',
    },
    href: '/invest/settlement',
  },
] satisfies Parameters<typeof SectionTabNav>[0]['tabs'];

export const Default: Story = {
  args: {
    title,
    description,
    tabs,
    activeIndex: 0,
    // onTabClick: (index: number) => {

    // },
  },
};
