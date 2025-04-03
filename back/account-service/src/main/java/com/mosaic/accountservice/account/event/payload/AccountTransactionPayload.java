package com.mosaic.accountservice.account.event.payload;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountTransactionPayload(Integer accountId, Integer targetId, BigDecimal amount,
										LocalDateTime createdAt) {
}
