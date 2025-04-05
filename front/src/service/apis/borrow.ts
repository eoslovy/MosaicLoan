import request from './request';

export interface CreditEvaluation {
  maxLoanLimit: number;
  interestRate: number;
  creditScore: number;
  createdAt?: string;
}

export interface LoanOverviewResponse {
  recentLoans: {
    dueDate: string;
    principal: number;
    interest: number;
    amount: number;
  }[];
  activeLoanCount: number;
  totalCount: number;
  activeLoanAmount: number;
  averageInterestRate: number; // 만분율
}

export const postCreditEvaluation = async (appliedAt: string) => {
  return request.POST<CreditEvaluation>('/api/evaluations', { appliedAt });
};

export const getRecentCreditEvaluation = async () => {
  return request.GET<CreditEvaluation>('/api/credit/evaluations/recent');
};

export const getLoanOverview = async () => {
  return request.GET<LoanOverviewResponse>('/api/contract/loans/overview');
};
