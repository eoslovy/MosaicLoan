package com.mosaic.payload;

import com.mosaic.core.model.Investment;
import com.mosaic.investment.dto.RequestInvestmentDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
	public static AccountTransactionPayload buildInvestWithdrawal(Investment investment, BigDecimal amountWithdraw) {
		return new AccountTransactionPayload(
				investment.getAccountId(),
				investment.getId(),
				amountWithdraw,
				investment.getCreatedAt()
		);
	}
}
