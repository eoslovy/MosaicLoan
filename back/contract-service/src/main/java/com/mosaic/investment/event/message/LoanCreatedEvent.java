package com.mosaic.investment.event.message;

import java.time.LocalDateTime;

import scala.math.BigDecimal;

public record LoanCreatedEvent(
	String loanId,
	String accountId,
	BigDecimal amount,
	LocalDateTime createdAt
) {
}
