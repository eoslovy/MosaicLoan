import React, { useState } from 'react';
import Slider from '@/components/common/Slider';

export default {
  title: 'Common/Slider',
  component: Slider,
};

export const Default = () => {
  const [value, setValue] = useState(100);

  return (
    <div style={{ width: '400px', padding: '1rem' }}>
      <p>현재 값: {value}</p>
      <Slider
        value={value}
        min={0}
        max={500}
        step={10}
        onChange={setValue}
        labelLeft="₩0"
        labelRight="₩500"
      />
    </div>
  );
};
