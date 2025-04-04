'use client';

import React from 'react';
import StatCard from '@/components/common/StatCard';
import styles from '@/styles/uis/StatsSection.module.scss';
import request from '@/service/apis/request';

interface MainStats {
  totalUsers: number;
  totalInvestment: number;
  totalrepaymentRate: number;
}

import { useState, useEffect } from 'react';

export default function StatsSection() {
  const [mainStats, setMainStats] = useState<MainStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const stats = await request.GET<MainStats>('/main');
      setMainStats(stats);
    };

    fetchData();
  }, []);

  if (!mainStats) return <div>Loading...</div>;

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
}
