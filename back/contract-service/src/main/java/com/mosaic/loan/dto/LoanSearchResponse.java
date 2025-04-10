package com.mosaic.loan.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record LoanSearchResponse(
	PaginationInfo pagination,
	List<LoanInfo> loans
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
	public record LoanInfo(
		Integer id,
		String amount,
		String requestAmount,
		String interestRate,
		String dueDate,
		String createdAt,
		String status
	) {
	}
} 