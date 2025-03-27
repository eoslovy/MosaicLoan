'use client';

import React from 'react';
import clsx from 'clsx';
import styles from '@/styles/uis/SliderGroupItem.module.scss';
import Text from '@/components/common/Text';
import Slider from '@/components/common/Slider';
import { SliderGroupItemProps } from '@/types/components';

const SliderGroupItem: React.FC<SliderGroupItemProps> = ({
  title,
  valueText,
  sliderValue,
  min,
  max,
  step = 1,
  labelLeft,
  labelRight,
  onChange,
  bgColor = 'none',
}) => {
  return (
    <div
      className={clsx(
        styles.sliderGroupItem,
        bgColor === 'light-blue' && styles.bgLightBlue
      )}
    >
      <Text text={title} size="sm" color="gray" weight="regular" />
      <Text
        text={valueText}
        size="xl"
        color="blue"
        weight="bold"
        className={styles.valueText}
      />

      <Slider
        value={sliderValue}
        min={min}
        max={max}
        step={step}
        labelLeft={labelLeft}
        labelRight={labelRight}
        onChange={onChange}
      />
    </div>
  );
};

export default SliderGroupItem;
