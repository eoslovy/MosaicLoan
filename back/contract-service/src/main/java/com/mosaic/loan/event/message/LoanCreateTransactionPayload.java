package com.mosaic.loan.event.message;

import com.mosaic.core.model.Loan;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;


public record LoanCreateTransactionPayload(
        Integer loanId,
        Integer accountId,
        BigDecimal amount,
        Integer rate,
        LocalDateTime createdAt
) {
    public static LoanCreateTransactionPayload buildLoan(Loan newLoan, CreditEvaluationResponseDto creditEvaluationResponseDto) {
        return new LoanCreateTransactionPayload(
                newLoan.getId(),
                newLoan.getAccountId(),
                newLoan.getRequestAmount(),
                creditEvaluationResponseDto.getInterestRate(),
                newLoan.getCreatedAt());
    }
}
