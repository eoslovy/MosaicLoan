'use client';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import InvestmentCalculator from '@/components/ui/InvestmentCalculator';

const meta: Meta<typeof InvestmentCalculator> = {
  title: 'UI/InvestmentCalculator',
  component: InvestmentCalculator,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InvestmentCalculator>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '2rem', background: '#f3f4f6', minHeight: '100vh' }}>
      <InvestmentCalculator />
    </div>
  ),
};
