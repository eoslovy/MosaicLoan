package com.mosaic.investment.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.Builder;

@Builder
public record ProfitHistoryResponse(
	List<ProfitInfo> profitHistory
) {
	@Builder
	public record ProfitInfo(
		String title,           // 수익명: "일부상환", "원금상환", "이자수익"
		LocalDate date,         // 날짜: 만기일(due_date)
		BigDecimal amount       // 금액
	) {
	}
} 