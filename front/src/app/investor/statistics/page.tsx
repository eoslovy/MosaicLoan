'use client';

import React, { useEffect, useState } from 'react';
import BarLineChart from '@/components/chart/BarLineChart';
import BarChart from '@/components/chart/BarChart';
import styles from '@/styles/investors/Statistics.module.scss';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import IndustryTreemapChart from '@/components/chart/IndustryTreemapChart';
import useRandomData from '@/hooks/useRandomData';
import useUser from '@/hooks/useUser';
import type { RawIndustryRatio } from '@/types/components';

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

// 차트 데이터의 안전한 처리를 위한 유틸리티 함수
const getSafeChartData = (dataArray: any[] = []) => {
  // 데이터가 없거나 배열이 아니면 더미 데이터 반환
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return {
      labels: ["데이터 없음"],
      counts: [0],
      amounts: [0],
      ratios: [0]
    };
  }

  // 안전하게 데이터 추출
  const labels = dataArray.map(item => (item?.group || "알 수 없음"));
  const counts = dataArray.map(item => (isFinite(item?.count) ? item.count : 0));
  const amounts = dataArray.map(item => (isFinite(item?.amount) ? item.amount : 0));
  const ratios = dataArray.map(item => (isFinite(item?.ratio) ? item.ratio : 0));

  return { labels, counts, amounts, ratios };
};

const StatisticsPage = () => {
  const { user, isFetched } = useUser();
  const [seedUserId, setSeedUserId] = useState<number>(42);
  const [chartRegistered, setChartRegistered] = useState(false);

  // Chart.js 등록을 클라이언트 사이드에서만 실행
  useEffect(() => {
    const registerChart = async () => {
      try {
        const { Chart, LineController, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement } = await import('chart.js');
        Chart.register(LineController, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement);
        setChartRegistered(true);
      } catch (error) {
        console.error("차트 등록 중 오류 발생:", error);
      }
    };
    registerChart();
  }, []);

  useEffect(() => {
    if (isFetched && user?.id) {
      setSeedUserId(user.id);
    }
  }, [user, isFetched]);

  const { data, isLoading, refresh } = useRandomData({
    userId: seedUserId,
    refreshInterval: null,
  });

  useAuthRedirect('/investor/statistics');

  if (isLoading || !isFetched || !chartRegistered)
    return <div className={styles.statusText}>로딩 중...</div>;
  if (!data)
    return (
      <div className={styles.statusText}>데이터를 불러올 수 없습니다.</div>
    );

  // 차트 데이터 안전하게 준비
  const ageData = getSafeChartData(data.byAge);
  const familyData = getSafeChartData(data.byFamilyStatus);
  const residenceData = getSafeChartData(data.byResidence);

  // 산업 데이터 안전하게 처리
  const industryData = Array.isArray(data.byIndustry) && data.byIndustry.length > 0
    ? data.byIndustry.map((item: RawIndustryRatio) => ({
        industry: getIndustryLabel(item.industry || 0),
        ratio: typeof item.ratio === 'number' ? item.ratio : 0,
      }))
    : [{ industry: '데이터 없음', ratio: 0 }];

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
                labels={ageData.labels}
                rawBarData={{ 거래건수: ageData.counts }}
                rawLineData={ageData.ratios}
                barCategories={['거래건수']}
                lineLabel='비율 (%)'
              />
            </div>
            <div className={styles.chartColumn}>
              <BarChart
                labels={ageData.labels}
                values={ageData.amounts}
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
                labels={familyData.labels}
                rawBarData={{
                  거래건수: familyData.counts,
                }}
                rawLineData={familyData.ratios}
                barCategories={['거래건수']}
                lineLabel='비율 (%)'
              />
            </div>
            <div className={styles.chartColumn}>
              <BarChart
                labels={familyData.labels}
                values={familyData.amounts}
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
                labels={residenceData.labels}
                rawBarData={{ 거래건수: residenceData.counts }}
                rawLineData={residenceData.ratios}
                barCategories={['거래건수']}
                lineLabel='비율 (%)'
              />
            </div>
            <div className={styles.chartColumn}>
              <BarChart
                labels={residenceData.labels}
                values={residenceData.amounts}
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
          data={industryData}
        />
      </div>
    </main>
  );
};

export default StatisticsPage;
