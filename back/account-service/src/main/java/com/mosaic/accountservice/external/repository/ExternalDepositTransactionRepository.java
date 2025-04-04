package com.mosaic.accountservice.external.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.accountservice.external.model.ExternalDepositTransaction;

public interface ExternalDepositTransactionRepository extends JpaRepository<ExternalDepositTransaction, Integer> {
}
