import type {
  InvestmentOverviewResponse,
  ContractSummaryResponse,
} from '@/types/pages';

export const mockInvestorOverview: InvestmentOverviewResponse = {
  summary: {
    총투자금액: '10000000',
    누적수익금: '1231234',
    평균수익률: 8.3,
    투자건수: 50,
  },
  investlist: [
    {
      투자명: '대박나는투자',
      투자금액: '123000',
      금리: '8.3',
      상환일: '2025-03-25',
      상태: '상환완료',
    },
    {
      투자명: '느긋한투자',
      투자금액: '430000',
      금리: '7.5',
      상환일: '2025-04-12',
      상태: '상환중',
    },
    {
      투자명: '위험한투자',
      투자금액: '50000',
      금리: '12.3',
      상환일: '2025-02-10',
      상태: '부실',
    },
  ],
  profitHistory: [
    {
      수익명: '이자수익',
      날짜: '2025-03-10',
      금액: '5000',
    },
    {
      수익명: '원금상환',
      날짜: '2025-03-09',
      금액: '10000',
    },
    {
      수익명: '환급',
      날짜: '2025-03-08',
      금액: '15000',
    },
  ],
  simulation: {
    '2025-01': [1000000, 1100000, 1200000],
    '2025-02': [1200000, 1300000, 1400000],
    '2025-03': [1400000, 1500000, 1600000],
  },
};

export const mockContractSummary: ContractSummaryResponse = {
  statusDistribution: {
    completed: 30,
    active: 120,
    default: 10,
    transferred: 5,
  },
  totalContractCount: 150,
  totalProfit: 7500000,
  totalLoss: 500000,
};
