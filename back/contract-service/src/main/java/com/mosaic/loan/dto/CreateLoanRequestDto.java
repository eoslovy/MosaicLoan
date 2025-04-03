package com.mosaic.loan.dto;

import java.time.LocalDate;

public record CreateLoanRequestDto(
	long id,
	int requestAmount,
	LocalDate due_date
) {
}