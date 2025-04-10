package com.mosaic.investment.dto;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record InvestmentSummaryResponse(
	BigDecimal totalInvestmentAmount,  // 총 투자 금액
	BigDecimal totalProfitAmount,      // 누적 수익금
	double averageProfitRate,          // 평균 수익률 (퍼센트)
	long investmentCount               // 투자 건수
) {
}