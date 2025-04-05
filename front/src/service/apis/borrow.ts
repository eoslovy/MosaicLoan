import request from './request';

export interface CreditEvaluation {
  maxLoanLimit: number;
  interestRate: number;
  creditScore: number;
  createdAt?: string;
}

export const postCreditEvaluation = async (appliedAt: string) => {
  return request.POST<CreditEvaluation>('/api/evaluations', { appliedAt });
};

export const getRecentCreditEvaluation = async () => {
  return request.GET<CreditEvaluation>('/api/credit/evaluations/recent');
};
