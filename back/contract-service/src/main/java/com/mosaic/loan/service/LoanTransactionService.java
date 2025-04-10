package com.mosaic.loan.service;

import java.time.LocalDateTime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.model.Loan;
import com.mosaic.investment.dto.WithdrawalInvestmentDto;
import com.mosaic.payload.AccountTransactionPayload;

import jakarta.transaction.Transactional;

public interface LoanTransactionService {
	@Transactional
	void publishLoanWithdrawalRequest(Loan loan, LocalDateTime now, Boolean isBot) throws
		JsonProcessingException;

	@Transactional
	void rollbackLoanWithdrawal(AccountTransactionPayload payload);

	@Transactional
	void failLoanRepayRequest(AccountTransactionPayload payload);

	@Transactional
	void executeLoanRepay(Loan loan, LocalDateTime now, Boolean isBot) throws Exception;

}
