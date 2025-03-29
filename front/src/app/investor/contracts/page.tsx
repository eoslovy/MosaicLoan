'use client';

import React from 'react';
import TotalContractsOverview from '@/components/investor/TotalContractsOverview';
import ContractsFilter from '@/components/investor/ContractsFilter';
import ContractsList from '@/components/investor/ContractsList';

const ContractsPage = () => {
  return (
    <>
      <div className="py-10 px-10">
        <TotalContractsOverview />
      </div>
      <ContractsFilter />
      <ContractsList />
    </>
  );
};

export default ContractsPage;
