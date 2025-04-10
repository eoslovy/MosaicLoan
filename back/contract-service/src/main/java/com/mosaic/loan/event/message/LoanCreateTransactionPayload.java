package com.mosaic.loan.event.message;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mosaic.core.model.Loan;
import com.mosaic.loan.dto.CreditEvaluationResponseDto;

public record LoanCreateTransactionPayload(
	Integer loanId,
	Integer accountId,
	BigDecimal amount,
	Integer interestRate,
	Integer defaultRate,
	Integer expectYieldRate,
	LocalDateTime createdAt
) {
	public static LoanCreateTransactionPayload buildLoan(Loan newLoan,
		CreditEvaluationResponseDto creditEvaluationResponseDto) {
		return new LoanCreateTransactionPayload(
			newLoan.getId(),
			newLoan.getAccountId(),
			newLoan.getRequestAmount(),
			creditEvaluationResponseDto.getInterestRate(),
			creditEvaluationResponseDto.getDefaultRate(),
			creditEvaluationResponseDto.getExpectYield(),
			newLoan.getCreatedAt());
	}
}
