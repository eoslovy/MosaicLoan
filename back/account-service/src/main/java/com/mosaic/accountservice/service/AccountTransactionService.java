package com.mosaic.accountservice.service;

import java.math.BigDecimal;

import com.mosaic.accountservice.domain.TransactionType;

public interface AccountTransactionService {
	void processTransaction(Integer accountId, BigDecimal amount, TransactionType type,
		String content, Integer targetId);
}
