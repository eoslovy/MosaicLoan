package com.mosaic.loan.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateLoanRequestDto(
	Integer id,
	BigDecimal requestAmount,
	LocalDate due_date
) {
}