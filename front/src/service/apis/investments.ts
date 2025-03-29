import type { InvestmentSummary } from '@/types/pages';

const isStaticExport = process.env.STATIC_EXPORT === 'true';

const fetchInvestmentSummary = async (): Promise<InvestmentSummary> => {
  const url = isStaticExport
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/investments/overview`
    : `/api/investor/overview`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message || '해당 정보를 불러올 수 없습니다.';
    throw new Error(message);
  }

  const data = await res.json();
  return data.summary;
};

export default fetchInvestmentSummary;
