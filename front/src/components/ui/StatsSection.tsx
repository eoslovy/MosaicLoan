import React from "react";
import StatCard from "@/components/common/StatCard";
import styles from "@/styles/uis/StatsSection.module.scss";

const StatsSection: React.FC = () => {
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.statsSection}>
        <StatCard icon="users" value="25,000명" label="누적 회원 수" />
        <StatCard icon="trendingUp" value="₩1,500억" label="누적 투자액" />
        <StatCard icon="clock" value="99.8%" label="상환율" />
      </div>
    </section>
  );
};

export default StatsSection;
