'use client';

import React from 'react';
import InvestmentResultPanel from '@/components/ui/InvestmentResultPanel';

export default {
  title: 'UI/InvestmentResultPanel',
  component: InvestmentResultPanel,
};

export const Default = () => (
  <div style={{ maxWidth: 400 }}>
    <InvestmentResultPanel
      amount={1000000}
      rate={8.8}
      setAmount={() => {}}
      setRate={() => {}}
    />
  </div>
);
