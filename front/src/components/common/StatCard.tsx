import React, { useEffect, useState } from 'react';
import styles from '@/styles/components/StatCard.module.scss';
import { StatCardProps } from '@/types/components';
import { Users, TrendingUp, Clock } from 'lucide-react';

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

  useEffect(() => {
    const end = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (Number.isNaN(end) || end === 0) return;

    const duration = 2000;
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const newValue = Math.floor(progress * end);

      setCount(newValue);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [value]);

  return (
    <article className={styles.statCard}>
      <div className={styles.iconWrapper}>
        <IconComponent size={25} color='#145DA0' />
      </div>
      <p className={styles.value}>
        {icon === 'trendingUp' ? (
          <>
            <span className={styles.prefix}>₩</span>
            <span>{count.toLocaleString()}</span>
            <span className={styles.suffix}>{unit}</span>
          </>
        ) : (
          `${count.toLocaleString()} ${unit}`
        )}
      </p>
      <p className={styles.label}>{label}</p>
    </article>
  );
};

export default StatCard;
