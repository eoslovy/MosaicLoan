export type InvestSectionTabNavProps = {
  activeIndex: number;
  onTabClick: (idx: number) => void;
};

export interface EmptyStateProps {
  message?: string;
}

export interface InvestmentSummary {
  총투자금액: string;
  누적수익금: string;
  평균수익률: number;
  투자건수: number;
}

export interface InvestmentItem {
  투자명: string;
  투자금액: string;
  금리: string;
  상환일: string;
  상태: '상환완료' | '상환중' | '부실';
}

export interface ProfitItem {
  수익명: string; // 예: '환급', '원금상환', '이자수익'
  날짜: string; // YYYY-MM-DD
  금액: string;
}

// 이건 /api/investments/overview 전체 응답의 타입
export interface InvestmentOverviewResponse {
  summary: InvestmentSummary;
  investlist: InvestmentItem[];
  profitHistory: ProfitItem[];
  simulation: Record<string, number[]>;
}

export interface InvestmentOverviewTableProps {
  investlist: InvestmentItem[];
  profitHistory: ProfitItem[];
}

export interface ContractSummaryResponse {
  statusDistribution: {
    completed: number;
    active: number;
    default: number;
    transferred: number;
  };
  totalContractCount: number;
  totalProfit: number;
  totalLoss: number;
}

export interface ContractRow {
  id: string;
  name: string;
  count: number;
  startDate: string;
  status: '진행중' | '완료';
}
