package com.mosaic.investment.dto;

import java.time.LocalDate;
import java.util.List;

import com.mosaic.core.model.status.ContractStatus;

import lombok.Builder;

@Builder
public record InvestmentTransactionSearchRequest(
	LocalDate startDate,
	LocalDate endDate,
	List<ContractStatus> types,
	List<Integer> investmentIds,
	int page,
	int pageSize,
	List<SortCriteria> sort,
	Integer interestRate,
	LocalDate dueDate
) {
	public int safePage() {
		return page <= 0 ? 0 : page - 1;
	}

	public int safePageSize() {
		return pageSize <= 0 ? 10 : pageSize;
	}

	@Builder
	public record SortCriteria(String field, String order) {
	}
} 