import React, { useRef, useEffect, useState } from 'react';
import { BasicInfoCardProps } from '@/types/components';
import styles from '@/styles/components/BasicInfoCard.module.scss';
import {
  CreditCard,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Percent,
} from 'lucide-react';

const iconMap = {
  creditCard: CreditCard,
  trendingUp: TrendingUp,
  clock: Clock,
  arrowUpRight: ArrowUpRight,
  percent: Percent,
};

const MAX_WIDTH = 200;

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  icon,
  value,
  label,
}) => {
  const IconComponent = iconMap[icon];
  const valueRef = useRef<HTMLParagraphElement>(null);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!valueRef.current) return;

    const measureTextWidth = (text: string) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return 0;
      context.font = 'bold 16px Arial';
      return context.measureText(text).width;
    };

    let truncatedValue = value;
    while (measureTextWidth(truncatedValue) > MAX_WIDTH) {
      truncatedValue = truncatedValue.slice(0, -1);
    }

    setDisplayValue(truncatedValue !== value ? `${truncatedValue}+` : value);
  }, [value]);

  return (
    <div className={styles.basicInfoCard}>
      <div className={styles.iconWrapper}>
        <IconComponent size={25} color='#145DA0' />
      </div>
      <div className={styles.content}>
        <p className={styles.value} ref={valueRef}>
          {displayValue}
        </p>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
};

export default BasicInfoCard;
