package com.mosaic.investment.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record InvestmentTransactionResponse(
	PaginationInfo pagination,
	List<TransactionInfo> transactions
) {
	@Builder
	public record PaginationInfo(
		int page,
		int pageSize,
		int totalPage,
		long totalItemCount
	) {
	}

	@Builder
	public record TransactionInfo(
		Integer contractId,
		Integer investmentId,
		String amount,
		String createdAt,
		String status,
		Integer interestRate,
		String dueDate
	) {
	}
} 