package com.mosaic.investment.event.message;

import com.mosaic.core.model.Investment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
