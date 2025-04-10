import type { InvestmentOverviewResponse, InvestOverview } from '@/types/pages';

export const mockInvestorOverview: InvestmentOverviewResponse = {
  summary: {
    totalInvestmentAmount: '10000000',
    totalProfitAmount: '1231234',
    averageProfitRate: 8.3,
    investmentCount: 50,
  },
  investmentlist: [
    {
      investmentId: '대박나는투자',
      investmentAmount: '123000',
      rate: '8.3',
      dueDate: '2025-03-25',
      status: 'COMPLETED',
    },
    {
      investmentId: '느긋한투자',
      investmentAmount: '430000',
      rate: '7.5',
      dueDate: '2025-04-12',
      status: 'ACTIVE',
    },
    {
      investmentId: '위험한투자',
      investmentAmount: '50000',
      rate: '12.3',
      dueDate: '2025-02-10',
      status: 'ACTIVE',
    },
  ],
  profitHistory: [
    {
      title: '이자수익',
      date: '2025-03-10',
      amount: '5000',
    },
    {
      title: '원금상환',
      date: '2025-03-09',
      amount: '10000',
    },
    {
      title: '환급',
      date: '2025-03-08',
      amount: '15000',
    },
  ],
  simulation: {
    '2025-01': [1000000, 1100000, 1200000],
    '2025-02': [1200000, 1300000, 1400000],
    '2025-03': [1400000, 1500000, 1600000],
  },
};

export const mockContractSummary: InvestOverview = {
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
