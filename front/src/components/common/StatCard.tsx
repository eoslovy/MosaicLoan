import React from "react";
import styles from "@/styles/components/StatCard.module.scss";
import  { StatCardProps } from "@/types/components";
import { Users, TrendingUp, Clock } from "lucide-react";

const iconMap = {
  users: Users,
  trendingUp: TrendingUp,
  clock: Clock,
};

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  const IconComponent = iconMap[icon];

  return (
    <article className={styles.statCard}>
      <div className={styles.iconWrapper}>
        <IconComponent size={25} color="#145DA0" />
      </div>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </article>
  );
};

export default StatCard;
