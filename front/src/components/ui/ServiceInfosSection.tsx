'use client';

import React from 'react';
import styles from '@/styles/uis/ServiceInfosSection.module.scss';
import Text from '@/components/common/Text';
import ServiceInfoCard from '@/components/common/ServiceInfoCard';

const ServiceInfosSection = () => {
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.inner}>
        <Text
          text="서비스 소개"
          size="text-3xl"
          color="blue"
          weight="bold"
        />
        <Text
          text="모자익론은 빅데이터를 기반으로 투자자와 대출자를 연결하는 P2P 금융 서비스 입니다"
          size="xl"
          color="light-blue"
          weight="regular"
          className={styles.description}
        />

        <div className={styles.cardsWrapper}>
        <ServiceInfoCard
          icon="shield"
          value="안전한 투자"
          label={
            <>
              철저한 심사와 다양한 보호 장치로<br />
              투자자의 자산을 안전하게 보호합니다.
            </>
          }
        />
        <ServiceInfoCard
          icon="trendingUp"
          value="높은 수익률"
          label={
            <>
              은행 대비 높은 금리로<br />
              효율적인 자산 증식이 가능합니다.
            </>
          }
        />
        <ServiceInfoCard
          icon="users"
          value="맞춤형 대출"
          label={
            <>
              개인의 신용과 상황에 맞는<br />
              최적의 대출 조건을 제공합니다.
            </>
          }
        />
        <ServiceInfoCard
          icon="clock"
          value="빠른 심사"
          label={
            <>
              AI 기반 심사 시스템으로 신속한<br />
              대출 심사와 승인이 이루어집니다.
            </>
          }
        />
        </div>
      </div>
    </section>
  );
};

export default ServiceInfosSection;
