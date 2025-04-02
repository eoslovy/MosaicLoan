'use client';

import React, { useEffect, useState } from 'react';
import TotalContractsOverview from '@/components/investor/TotalContractsOverview';
import ContractsFilter from '@/components/investor/ContractsFilter';
import ContractsList from '@/components/investor/ContractsList';
import { fetchContractSummary } from '@/service/apis/investments';
import EmptyState from '@/components/empty/investor/EmptyState';

const ContractsPage = () => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchContractSummary();
        setData(result);
      } catch (error) {
        console.error('채권 요약 정보 요청 실패', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <EmptyState message='채권 정보를 불러오는 중입니다' />;
  }

  if (isError || !data) {
    return <EmptyState message='채권 요약 정보를 불러올 수 없습니다.' />;
  }

  return (
    <>
      <TotalContractsOverview data={data} />
      <ContractsFilter />
      <ContractsList />
    </>
  );
};

export default ContractsPage;
