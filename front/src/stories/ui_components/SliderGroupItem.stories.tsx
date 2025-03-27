import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SliderGroupItem from '@/components/ui/SliderGroupItem';

const meta: Meta<typeof SliderGroupItem> = {
  title: 'UI/SliderGroupItem',
  component: SliderGroupItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SliderGroupItem>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(1000000);

    return (
      <div style={{ width: '400px', padding: '2rem', background: '#f5f5f5' }}>
        <SliderGroupItem
          title="투자 금액"
          valueText={`₩${value.toLocaleString()}`}
          sliderValue={value}
          min={100000}
          max={50000000}
          step={100000}
          labelLeft="10만원"
          labelRight="5천만원"
          onChange={(val) => setValue(val)}
        />
      </div>
    );
  },
};
