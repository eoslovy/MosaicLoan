package com.mosaic.accountservice.external.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.accountservice.external.model.ExternalWithdrawalTransaction;

public interface ExternalWithdrawalRepository extends JpaRepository<ExternalWithdrawalTransaction, Integer> {
}
