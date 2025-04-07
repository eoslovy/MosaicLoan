'use client';

import React, { useEffect, useState } from 'react';
import BarLineChart from '@/components/chart/BarLineChart';
import BarChart from '@/components/chart/BarChart';
import request from '@/service/apis/request';
import styles from '@/styles/investors/Statistics.module.scss';

import IndustryTreemapChart from '@/components/chart/IndustryTreemapChart';
// import IndustryHeatMapChart from '@/components/chart/IndustryHeatMapChart';
import type {
  InvestmentStatisticsResponse,
  RawIndustryRatio,
} from '@/types/components';

const getIndustryLabel = (code: number) => {
  const map: Record<number, string> = {
    0: '기타(미상)',
    1: '기타',
    2: '정부기관',
    3: '농업',
    4: '운송',
    5: '교육',
    6: '광업',
    7: '금융',
    8: '유통',
    9: '의료',
    10: '제조업',
    11: '통신/우편',
    12: '부동산',
    13: '관광',
    14: '요식업',
    15: 'IT',
    16: '마케팅',
    17: '보험',
    18: '인사/채용',
    19: '법률',
  };
  return map[code] ?? `산업 ${code}`;
};

const StatisticsPage = () => {
  const [data, setData] = useState<InvestmentStatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.GET<InvestmentStatisticsResponse>(
          '/contract/investments/statistics',
        );
        setData(res);
      } catch (e) {
        console.error('통계 데이터를 불러오는 중 오류 발생', e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className={styles.statusText}>로딩 중...</div>;
  if (isError || !data)
    return (
      <div className={styles.statusText}>데이터를 불러올 수 없습니다.</div>
    );

  const renderBarLineSection = (
    title: string,
    items: { group: string; count: number; ratio: number }[],
  ) => (
    <section className={styles.chartSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <BarLineChart
        labels={items.map((i) => i.group)}
        rawBarData={{ 거래건수: items.map((i) => i.count) }}
        rawLineData={items.map((i) => i.ratio)}
        barCategories={['거래건수']}
        lineLabel='비율 (%)'
      />
    </section>
  );

  const renderBarSection = (
    title: string,
    items: { group: string; amount: number }[],
  ) => (
    <section className={styles.chartSection}>
      <h3 className={styles.sectionSubtitle}>{title}</h3>
      <BarChart
        labels={items.map((i) => i.group)}
        values={items.map((i) => i.amount)}
        title='총 거래 금액'
      />
    </section>
  );

  return (
    <main className={styles.statisticsPage}>
      <h1 className={styles.pageTitle}>채권 통계</h1>

      {renderBarLineSection('연령대별 거래 건수 및 비율', data.byAge)}
      {renderBarSection('연령대별 거래 금액', data.byAge)}

      {renderBarLineSection(
        '가구 유형별 거래 건수 및 비율',
        data.byFamilyStatus,
      )}
      {renderBarSection('가구 유형별 거래 금액', data.byFamilyStatus)}

      {renderBarLineSection('주거 형태별 거래 건수 및 비율', data.byResidence)}
      {renderBarSection('주거 형태별 거래 금액', data.byResidence)}

      <IndustryTreemapChart
        data={data.byIndustry.map((item: RawIndustryRatio) => ({
          industry: getIndustryLabel(item.industry),
          ratio: item.ratio,
        }))}
      />
    </main>
  );
};

export default StatisticsPage;
