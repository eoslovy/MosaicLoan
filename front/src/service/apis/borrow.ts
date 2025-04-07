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
  memberId,
}: {
  appliedAt: string;
  memberId: number;
}) => {
  return request.POST<CreditEvaluation>('/api/evaluations', {
    appliedAt,
    memberId,
  });
};

export const getRecentCreditEvaluation = async () => {
  return request.GET<CreditEvaluation>('/api/credit/evaluations/recent');
};

export const getLoanOverview = async () => {
  return request.GET<LoanOverviewResponse>('/api/contract/loans/overview');
};

export const postLoanRequest = async (data: PostLoanRequestBody) => {
  return request.POST('/api/contract/loans/', data);
};
