import React from 'react';
import StatCard from '@/components/common/StatCard';
import styles from '@/styles/uis/StatsSection.module.scss';
import request from '@/service/apis/request';

interface MainStats {
  totalUsers: number;
  totalInvestment: number;
  totalrepaymentRate: number;
}

async function StatsSection() {
  const mainStats = await request.POST<MainStats>('/main');
  const { totalUsers: users, totalInvestment: investment, totalrepaymentRate: repaymentRate } = mainStats;
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.statsSection}>
        <StatCard icon='users' value={`${users.toLocaleString()}명`} label='누적 회원 수' />
        <StatCard icon='trendingUp' value={`₩${investment.toLocaleString()}`} label='누적 투자액' />
        <StatCard icon='clock' value={`${repaymentRate.toFixed(1)}%`} label='상환율' />
      </div>
    </section>
  );
};

export default StatsSection;
