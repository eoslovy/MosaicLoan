'use client';

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import InvestmentInputPanel from '@/components/ui/InvestmentInputPanel';

const meta: Meta<typeof InvestmentInputPanel> = {
  title: 'UI/InvestmentInputPanel',
  component: InvestmentInputPanel,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InvestmentInputPanel>;

export const Default: Story = {
  render: () => {
    const [amount, setAmount] = useState(1000000);
    const [duration, setDuration] = useState(12);
    const [rate, setRate] = useState(8.8);

    return (
      <div style={{ width: '400px', padding: '2rem', background: '#f9fafb' }}>
        <InvestmentInputPanel
          amount={amount}
          setAmount={setAmount}
          duration={duration}
          setDuration={setDuration}
          rate={rate}
          setRate={setRate}
        />
      </div>
    );
  },
};
