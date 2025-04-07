package com.mosaic.payload;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mosaic.core.model.Investment;
import com.mosaic.investment.dto.RequestInvestmentDto;

public record AccountTransactionPayload(Integer accountId, Integer targetId, BigDecimal amount,
										LocalDateTime createdAt) {
	public static AccountTransactionPayload buildInvest(Investment investment, RequestInvestmentDto requestDto) {
		return new AccountTransactionPayload(
			investment.getAccountId(),
			investment.getId(),
			requestDto.principal(),
			investment.getCreatedAt()
		);
	}
}
