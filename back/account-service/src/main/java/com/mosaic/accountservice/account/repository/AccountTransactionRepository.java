package com.mosaic.accountservice.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosaic.accountservice.account.domain.AccountTransaction;

public interface AccountTransactionRepository
	extends JpaRepository<AccountTransaction, Integer>, AccountTransactionQueryRepository {
}
