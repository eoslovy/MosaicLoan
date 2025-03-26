'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/components/StatCard.module.scss';
import { StatCardProps } from '@/types/components';
import { Users, TrendingUp, Clock } from 'lucide-react';
import Text from '@/components/common/Text';

const iconMap = {
  users: Users,
  trendingUp: TrendingUp,
  clock: Clock,
};

const unitMap = {
  users: '명',
  trendingUp: '원',
  clock: '%',
};

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  const IconComponent = iconMap[icon];
  const unit = unitMap[icon];
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const animateCount = () => {
    const end = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (Number.isNaN(end) || end === 0) return;

    const duration = 2000;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newValue = Math.floor(progress * end);

      setCount(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateCount();
        } else {
          // 뷰포트 벗어나면 초기화
          setCount(0);
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value]);

  return (
    <article className={styles.statCard} ref={ref}>
      <div className={styles.iconWrapper}>
        <IconComponent size={25} color='#145DA0' />
      </div>

      <div className={styles.value}>
        {icon === 'trendingUp' ? (
          <Text
            text={`₩${count.toLocaleString()}${unit}`}
            size="text-3xl"
            color="blue"
            weight="bold"
          />
        ) : (
          <Text
            text={`${count.toLocaleString()} ${unit}`}
            size="text-3xl"
            color="blue"
            weight="bold"
          />
        )}
      </div>

      <div className={styles.label}>
        <Text text={label} size="md" color="gray" weight="regular" />
      </div>
    </article>
  );
};

export default StatCard;
