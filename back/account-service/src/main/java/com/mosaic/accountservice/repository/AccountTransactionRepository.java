package com.mosaic.accountservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.accountservice.domain.AccountTransaction;

public interface AccountTransactionRepository extends JpaRepository<AccountTransaction, Integer> {
}
