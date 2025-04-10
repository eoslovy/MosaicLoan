package com.mosaic.loan.dto;

import java.math.BigDecimal;

public record CreateLoanRequestDto(
	BigDecimal requestAmount,
	Integer targetWeeks
) {
}