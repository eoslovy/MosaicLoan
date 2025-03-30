'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import TotalContractsOverview from '@/components/investor/TotalContractsOverview';
import ContractsFilter from '@/components/investor/ContractsFilter';
import ContractsList from '@/components/investor/ContractsList';
import { fetchContractSummary } from '@/service/apis/investments';
import EmptyState from '@/components/empty/investor/EmptyState';

const ContractsPage = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['contractSummary'],
    queryFn: fetchContractSummary,
  });

  if (isLoading) {
    return <EmptyState message='채권 정보를 불러오는 중입니다' />;
  }

  if (isError || !data) {
    return <EmptyState message='채권 요약 정보를 불러올 수 없습니다.' />;
  }

  return (
    <>
      {/* <div className='py-10 px-10'>
        
      </div> */}
      <TotalContractsOverview data={data} />
      <ContractsFilter />
      <ContractsList />
    </>
  );
};

export default ContractsPage;
