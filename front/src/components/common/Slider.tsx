'use client';

import React from 'react';
import styles from '@/styles/components/Slider.module.scss';
import { SliderProps } from '@/types/components';

const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  labelLeft,
  labelRight,
}) => {
  return (
    <div className={styles.sliderWrapper}>
      <input
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className={styles.labelRow}>
        <span>{labelLeft}</span>
        <span>{labelRight}</span>
      </div>
    </div>
  );
};

export default Slider;
