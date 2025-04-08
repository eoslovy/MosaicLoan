export type InvestSectionTabNavProps = {
  activeIndex: number;
  onTabClick: (idx: number) => void;
};

export interface EmptyStateProps {
  message?: string;
  className?: string;
  isComponentLevel?: boolean;
  preserveHeight?: boolean;
  minHeight?: string;
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

export interface LoanDetail {
  date: string;
  type: string;
  amount: string;
  balance: string;
}

export interface Loan {
  id: string;
  name: string;
  amount: string;
  startDate: string;
  endDate: string;
  rate: string;
  status: '상환중' | '상환완료' | '부실확정' | '연체';
  details: LoanDetail[];
}

// 거래 타입 정의
export type AccountTransactionType =
  | 'INVESTMENT_IN' // 투자금 입금
  | 'INVESTMENT_OUT' // 투자금 출금
  | 'LOAN_IN' // 대출금 입금
  | 'LOAN_OUT' // 대출금 출금
  | 'EXTERNAL_IN' // 외부 입금
  | 'EXTERNAL_OUT'; // 외부 출금

// 단일 거래 항목
export interface AccountTransaction {
  amount: number; // 거래금액
  cash: number; // 거래 후 잔액
  type: AccountTransactionType;
  content: string;
  createdAt: string;
  targetId: number;
}

// 응답 페이징 정보
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItemCount: number;
}

// 전체 응답 타입
export interface AccountTransactionResponse {
  data: AccountTransaction[];
  pagination: PaginationInfo;
}
