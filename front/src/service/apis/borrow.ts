import request from './request';

export interface CreditEvaluation {
  maxLoanLimit: number;
  interestRate: number;
  creditScore: number;
  createdAt?: string;
}

export interface PostLoanRequestBody {
  id: number;
  requestAmount: number;
  targetWeeks: number;
}

export interface LoanOverviewResponse {
  recentLoans: {
    dueDate: string;
    principal: number;
    interestRate: number;
    amount: number;
  }[];
  activeLoanCount: number;
  totalCount: number;
  activeLoanAmount: number;
  averageInterestRate: number; // 만분율
}

export const postCreditEvaluation = async ({
  appliedAt,
}: {
  appliedAt: string;
}) => {
  return request.POST<CreditEvaluation>('/credit/evaluations', {
    appliedAt,
  });
};

export const getRecentCreditEvaluation = async () => {
  return request.GET<CreditEvaluation>('/credit/evaluations/recent');
};

export const getLoanOverview = async () => {
  return request.GET<LoanOverviewResponse>('/contract/loans/overview');
};

export const postLoanRequest = async (data: PostLoanRequestBody) => {
  return request.POST('/contract/loans', data);
};
