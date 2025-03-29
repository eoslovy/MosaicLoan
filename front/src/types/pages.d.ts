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
