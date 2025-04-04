package com.mosaic.investment.event.message;

import com.mosaic.core.model.Loan;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ContractTransactionPayload(Integer accountId, Integer targetId, BigDecimal amount, Integer rate,
                                         LocalDate dueDate,
                                         LocalDateTime createdAt) {
    public static ContractTransactionPayload buildInvest(Loan loan, Integer rate) {
        return new ContractTransactionPayload(
                loan.getId(),
                loan.getAccountId(),
                loan.getAmount(),
                rate,
                loan.getDueDate(),
                loan.getCreatedAt()
        );
    }
}
