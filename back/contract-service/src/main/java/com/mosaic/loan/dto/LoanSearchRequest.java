package com.mosaic.loan.dto;

import java.time.LocalDate;
import java.util.List;

import com.mosaic.core.model.status.LoanStatus;

import lombok.Builder;

@Builder
public record LoanSearchRequest(
	LocalDate startDate,
	LocalDate endDate,
	List<LoanStatus> types,
	int page,
	int pageSize,
	List<SortCriteria> sort
) {
	public int safePage() {
		return page <= 0 ? 0 : page - 1;
	}

	public int safePageSize() {
		return pageSize <= 0 ? 10 : pageSize;
	}

	public record SortCriteria(String field, String order) {
	}
} 