'use client';

import React from 'react';
import { ServiceInfoCardProps } from '@/types/components';
import styles from '@/styles/components/ServiceInfoCard.module.scss';
import { Shield, TrendingUp, Users, Clock } from 'lucide-react';
import Text from '@/components/common/Text';

const iconMap = {
  shield: Shield,
  trendingUp: TrendingUp,
  users: Users,
  clock: Clock,
};

const ServiceInfoCard: React.FC<ServiceInfoCardProps> = ({
  icon,
  value,
  label,
}) => {
  const IconComponent = iconMap[icon];

  return (
    <article className={`${styles.serviceInfoCard} ${styles.contentWrapper}`}>
      <div className={styles.iconWrapper}>
        <IconComponent size={25} color="#145DA0" />
      </div>

      <Text
        text={value}
        size="xl"
        color="blue"
        weight="bold"
      />
      <Text
        text={label}
        size="md"
        color="gray"
        weight="regular"
      />
    </article>
  );
};

export default ServiceInfoCard;
