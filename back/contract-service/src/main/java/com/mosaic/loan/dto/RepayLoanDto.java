package com.mosaic.loan.dto;

import java.math.BigDecimal;

public record RepayLoanDto(
	Integer id,
	BigDecimal principal,
	Integer targetRate,
	Integer targetWeeks) {
}
