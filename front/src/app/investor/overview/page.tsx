'use client';

import React, { useEffect, useState } from 'react';
import Overview from '@/components/investor/Overview';
import OverviewTable from '@/components/investor/OverviewTable';
import OverviewInvestSimulation from '@/components/investor/OverviewInvestSimulation';
import InvestButton from '@/components/investor/InvestButton';
import InvestorOverviewSkeleton from '@/components/loading/InvestorOverviewSkeleton';
import type {
  InvestmentItem,
  InvestmentSummary,
  ProfitItem,
} from '@/types/pages';
import request from '@/service/apis/request';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import type { PillVariant } from '@/types/components';

// 새로운 API 응답 타입 정의
interface SummaryResponse {
  totalInvestmentAmount: number;
  totalProfitAmount: number;
  averageProfitRate: number;
  investmentCount: number;
}

interface InvestmentListResponse {
  investmentList: Array<{
    investmentId: number;
    investmentAmount: number;
    rate: number;
    dueDate: string;
    status: string;
  }>;
}

interface ProfitHistoryResponse {
  profitHistory: Array<{
    title: string;
    date: string;
    amount: string;
  }>;
}

const OverviewPage = () => {
  // 각 컴포넌트별 데이터와 로딩 상태 관리
  const [summaryData, setSummaryData] = useState<InvestmentSummary | null>(
    null,
  );
  const [investmentList, setInvestmentList] = useState<InvestmentItem[]>([]);
  const [profitHistory, setProfitHistory] = useState<ProfitItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const router = useRouter();
  //   const { user, isFetched } = useUser();

  //   useEffect(() => {
  //     if (isFetched && !user) {
  //       router.push('/investor/overview');
  //     }
  //   }, [user, isFetched]);
  useAuthRedirect('/investor/overview');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 동시에 모든 API 요청 실행
        const [summaryResult, investmentResult, profitResult] =
          await Promise.all([
            request.GET<SummaryResponse>('/contract/investments/summary'),
            request.GET<InvestmentListResponse>('/contract/investments/recent'),
            request.GET<ProfitHistoryResponse>('/contract/investments/profits'),
          ]);

        // Summary 데이터 매핑
        setSummaryData({
          totalInvestmentAmount: summaryResult.totalInvestmentAmount.toString(),
          totalProfitAmount: summaryResult.totalProfitAmount.toString(),
          averageProfitRate: summaryResult.averageProfitRate,
          investmentCount: summaryResult.investmentCount,
        });

        // Investment 리스트 매핑
        const mappedInvestments = investmentResult.investmentList.map(
          (item) => ({
            investmentId: `투자 #${item.investmentId}`,
            investmentAmount: item.investmentAmount.toString(),
            rate: item.rate.toString(),
            dueDate: item.dueDate,
            status: item.status as 'REQUESTED' | 'ACTIVE' | 'COMPLETED',
          }),
        );
        setInvestmentList(mappedInvestments);

        // Profit 히스토리 매핑
        const mappedProfits = profitResult.profitHistory.map((item) => ({
          title: item.title,
          date: item.date,
          amount: item.amount,
        }));
        setProfitHistory(mappedProfits);
      } catch (e: unknown) {
        if (process.env.NODE_ENV === 'development') {
          if (e instanceof Error) {
            console.error('데이터를 불러오지 못했습니다.', e.message);
          } else {
            console.error('알 수 없는 오류 발생', e);
          }
        }

        // 에러 발생 시 기본값 설정
        setSummaryData({
          totalInvestmentAmount: '',
          totalProfitAmount: '',
          averageProfitRate: 0,
          investmentCount: 0,
        });
        setInvestmentList([]);
        setProfitHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (isLoading || summaryData === null) {
    return <InvestorOverviewSkeleton />;
  }

  return (
    <>
      <InvestButton />
      <Overview summary={summaryData} />
      <OverviewTable
        investmentlist={investmentList}
        profitHistory={profitHistory}
      />
      <OverviewInvestSimulation />
    </>
  );
};

export default OverviewPage;
