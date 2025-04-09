'use client';

import React, { useEffect, useState } from 'react';
import BarLineChart from '@/components/chart/BarLineChart';
import BarChart from '@/components/chart/BarChart';
import request from '@/service/apis/request';
import styles from '@/styles/investors/Statistics.module.scss';

import IndustryTreemapChart from '@/components/chart/IndustryTreemapChart';
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

  return (
    <main className={styles.statisticsPage}>
      <h1 className={styles.pageTitle}>채권 통계</h1>

      {/* 연령별 섹션 */}
      <div>
        <h2 className={styles.categoryTitle}>나이대별 거래 현황</h2>
        <div className={styles.categoryContent}>
          <div className={styles.chartRow}>
            <div className={styles.chartColumn}>
              <BarLineChart
                labels={data.byAge.map((i) => i.group)}
                rawBarData={{ 거래건수: data.byAge.map((i) => i.count) }}
                rawLineData={data.byAge.map((i) => i.ratio)}
                barCategories={['거래건수']}
                lineLabel='비율 (%)'
              />
            </div>
            <div className={styles.chartColumn}>
              <BarChart
                labels={data.byAge.map((i) => i.group)}
                values={data.byAge.map((i) => i.amount)}
                title='거래 금액'
              />
            </div>
          </div>
        </div>
      </div>

      {/* 가구유형별 섹션 */}
      <div>
        <h2 className={styles.categoryTitle}>가구유형별 거래 현황</h2>
        <div className={styles.categoryContent}>
          <div className={styles.chartRow}>
            <div className={styles.chartColumn}>
              <BarLineChart
                labels={data.byFamilyStatus.map((i) => i.group)}
                rawBarData={{
                  거래건수: data.byFamilyStatus.map((i) => i.count),
                }}
                rawLineData={data.byFamilyStatus.map((i) => i.ratio)}
                barCategories={['거래건수']}
                lineLabel='비율 (%)'
              />
            </div>
            <div className={styles.chartColumn}>
              <BarChart
                labels={data.byFamilyStatus.map((i) => i.group)}
                values={data.byFamilyStatus.map((i) => i.amount)}
                title='거래 금액'
              />
            </div>
          </div>
        </div>
      </div>

      {/* 주거형태별 섹션 */}
      <div>
        <h2 className={styles.categoryTitle}>주택유형별 거래 현황</h2>
        <div className={styles.categoryContent}>
          <div className={styles.chartRow}>
            <div className={styles.chartColumn}>
              <BarLineChart
                labels={data.byResidence.map((i) => i.group)}
                rawBarData={{ 거래건수: data.byResidence.map((i) => i.count) }}
                rawLineData={data.byResidence.map((i) => i.ratio)}
                barCategories={['거래건수']}
                lineLabel='비율 (%)'
              />
            </div>
            <div className={styles.chartColumn}>
              <BarChart
                labels={data.byResidence.map((i) => i.group)}
                values={data.byResidence.map((i) => i.amount)}
                title='거래 금액'
              />
            </div>
          </div>
        </div>
      </div>

      {/* 산업별 트리맵 */}
      <div className={styles.treeMapContainer}>
        <h2 className={styles.treeMapTitle}>산업별 비율</h2>
        <IndustryTreemapChart
          data={data.byIndustry.map((item: RawIndustryRatio) => ({
            industry: getIndustryLabel(item.industry),
            ratio: item.ratio,
          }))}
        />
      </div>
    </main>
  );
};

export default StatisticsPage;
