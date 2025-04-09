package com.mosaic.investment.dto;

import java.math.BigDecimal;

public record RequestInvestmentDto(
	BigDecimal principal,
	Integer targetRate,
	Integer targetWeeks
) {
}