package com.mosaic.payload;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountTransactionPayload(Integer accountId, Integer targetId, BigDecimal amount,
										LocalDateTime createdAt, Integer compensationTargetId) {
	public static AccountTransactionPayload forCompleted(AccountTransactionPayload payload, Integer transactionId) {
		return new AccountTransactionPayload(payload.accountId(), payload.targetId(), payload.amount(),
			payload.createdAt(), transactionId);
	}
}
