package com.mosaic.investment.event.message;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mosaic.core.model.Investment;

public record AccountTransactionPayload(Integer accountId, Integer targetId, BigDecimal amount,
										LocalDateTime createdAt) {
	public static AccountTransactionPayload buildInvest(Investment investment) {
		return new AccountTransactionPayload(
			investment.getId(),
			investment.getAccountId(),
			investment.getPrincipal(),
			investment.getCreatedAt()
		);
	}
}
