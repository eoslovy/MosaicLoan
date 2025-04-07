package com.mosaic.accountservice.account.dto;

import java.time.LocalDate;
import java.util.List;

import com.mosaic.accountservice.account.domain.TransactionType;

import lombok.Builder;

@Builder
public record AccountTransactionSearchRequest(
	LocalDate startDate,
	LocalDate endDate,
	List<TransactionType> types,
	int page,
	int pageSize
) {
	public int safePage() {
		return page <= 0 ? 0 : page - 1;
	}

	public int safePageSize() {
		return pageSize <= 0 ? 10 : pageSize;
	}
}