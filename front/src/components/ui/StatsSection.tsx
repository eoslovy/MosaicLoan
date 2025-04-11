'use client';

import StatCard from '@/components/common/StatCard';
import styles from '@/styles/uis/StatsSection.module.scss';

const StatsSection = () => {
  const mainStats = {
    totalUsers: 100000,
    totalInvestment: 86500000,
    totalrepaymentRate: 97.6,
  };

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.statsSection}>
        <StatCard
          icon='users'
          value={`${mainStats.totalUsers.toLocaleString()}명`}
          label='누적 회원 수'
        />
        <StatCard
          icon='trendingUp'
          value={`₩${mainStats.totalInvestment.toLocaleString()}`}
          label='누적 투자액'
        />
        <StatCard
          icon='clock'
          value={`${mainStats.totalrepaymentRate.toFixed(1)}%`}
          label='상환율'
        />
      </div>
    </section>
  );
};

export default StatsSection;
