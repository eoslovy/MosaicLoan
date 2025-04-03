package com.mosaic.investment.event.message;

import java.math.BigDecimal;
import java.time.Instant;

import com.mosaic.core.model.Investment;

public record InvestRequestEvent(
	Integer accountId,
	BigDecimal principal,
	Instant createdAt
) {
	public static InvestRequestEvent buildInvest(Investment investment) {
		return new InvestRequestEvent(
			investment.getAccountId(),
			investment.getPrincipal(),
			investment.getCreatedAt()
		);
	}
}
