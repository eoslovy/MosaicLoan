package com.mosaic.loan.dto;

import java.util.List;

import com.mosaic.core.model.status.ContractTransactionType;

import lombok.Builder;

@Builder
public record LoanTransactionsResponse(
	List<TransactionInfo> transactions
) {
	@Builder
	public record TransactionInfo(
		Integer contractId,
		Integer loanId,
		String amount,
		String createdAt,
		ContractTransactionType status
	) {
	}
} 