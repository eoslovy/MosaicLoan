package com.mosaic.loan.service;

import java.time.LocalDateTime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.model.Loan;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.payload.AccountTransactionPayload;

import jakarta.transaction.Transactional;

public interface LoanService {
	void createLoan(CreateLoanRequestDto request, Integer memberId, LocalDateTime now, Boolean isBot) throws
		JsonProcessingException;

	@Transactional
	void manageInterestOfDelinquentLoans(LocalDateTime now, Boolean isBot);

	@Transactional
	void liquidateScheduledDelinquentLoans(LocalDateTime now, Boolean isBot) throws Exception;

	//상환입금
	void publishAndCalculateLoanRepayRequest(Loan loan,
		Boolean isBot, LocalDateTime now) throws JsonProcessingException;

	void completeLoanDepositRequest(AccountTransactionPayload accountTransactionComplete) throws
		JsonProcessingException;

	@Transactional
	void findRepaymentDueLoansAndRequestRepayment(LocalDateTime time, Boolean isBot) throws JsonProcessingException;

	void executeDueLoanRepayments(LocalDateTime time, Boolean isBot) throws Exception;

	// void executeLoanRepaymentsById(Integer loanId, LocalDateTime now, Boolean isBot) throws Exception;
}
