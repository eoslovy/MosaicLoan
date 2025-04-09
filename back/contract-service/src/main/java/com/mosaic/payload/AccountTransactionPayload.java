package com.mosaic.payload;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mosaic.core.model.Investment;
import com.mosaic.core.model.Loan;
import com.mosaic.investment.dto.RequestInvestmentDto;

public record AccountTransactionPayload(Integer accountId, Integer targetId, BigDecimal amount,
										LocalDateTime createdAt, Integer compensationTargetId) {
	public static AccountTransactionPayload buildInvest(Investment investment, RequestInvestmentDto requestDto,
		LocalDateTime now) {
		return new AccountTransactionPayload(
			investment.getAccountId(),
			investment.getId(),
			requestDto.principal(),
			now,
			null
		);
	}

	public static AccountTransactionPayload buildInvestWithdrawal(Investment investment, BigDecimal amountWithdraw,
		LocalDateTime now) {
		return new AccountTransactionPayload(
			investment.getAccountId(),
			investment.getId(),
			amountWithdraw,
			now,
			null
		);
	}

	public static AccountTransactionPayload buildLoanWithdrawal(Loan loan, BigDecimal withdrawnAmount,
		LocalDateTime now) {
		return new AccountTransactionPayload(
			loan.getAccountId(),
			loan.getId(),
			withdrawnAmount,
			now,
			null
		);
	}

	public static AccountTransactionPayload buildLoanRepay(Loan loan, BigDecimal moneyToRepay, LocalDateTime now) {
		return new AccountTransactionPayload(
			loan.getAccountId(),
			loan.getId(),
			moneyToRepay,
			now,
			null
		);
	}
}
