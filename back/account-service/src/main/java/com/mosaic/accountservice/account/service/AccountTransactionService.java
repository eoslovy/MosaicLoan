package com.mosaic.accountservice.account.service;

import java.math.BigDecimal;

import com.mosaic.accountservice.account.domain.TransactionType;

public interface AccountTransactionService {
	void processTransaction(Integer accountId, BigDecimal amount, TransactionType type,
		String content, Integer targetId);
}
