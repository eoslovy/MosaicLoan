package com.mosaic.payload;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountTransactionPayload(Integer accountId, Integer targetId, BigDecimal amount,
										LocalDateTime createdAt) {
}
