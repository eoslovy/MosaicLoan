package com.mosaic.investment.event.message;

import java.math.BigDecimal;
import java.time.LocalDateTime;


public record LoanCreatedEvent(
	String loanId,
	String accountId,
	BigDecimal amount,
	LocalDateTime createdAt
) {
}
