import React from 'react';
import { ServiceInfoCardProps } from '@/types/components';
import styles from '@/styles/components/ServiceInfoCard.module.scss';
import { Shield, TrendingUp, Users, Clock } from 'lucide-react';

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
        <IconComponent size={25} color='#145DA0' />
      </div>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </article>
  );
};

export default ServiceInfoCard;
