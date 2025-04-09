import type {
  InvestmentSummary,
  InvestmentOverviewResponse,
  InvestOverview,
} from '@/types/pages';
import { mockInvestorOverview, mockContractSummary } from '@/data/mockData';

const isStaticExport = process.env.STATIC_EXPORT === 'true';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInvestmentSummary = async (): Promise<InvestmentSummary> => {
  return mockInvestorOverview.summary;
};

export const fetchInvestmentOverview =
  async (): Promise<InvestmentOverviewResponse> => {
    return mockInvestorOverview;
  };

export const fetchContractSummary = async (): Promise<InvestOverview> => {
  return mockContractSummary;
};
