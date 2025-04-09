package com.mosaic.loan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.investment.dto.WithdrawalInvestmentDto;
import com.mosaic.loan.dto.CreateLoanRequestDto;
import com.mosaic.loan.dto.RepayLoanDto;
import com.mosaic.payload.AccountTransactionPayload;

public interface LoanService {
	void createLoan(CreateLoanRequestDto request, Boolean isBot) throws JsonProcessingException;

	void publishLoanWithdrawalRequest(WithdrawalInvestmentDto requestDto, Boolean isBot) throws
		JsonProcessingException;

	//상환입금
	void publishAndCalculateLoanRepayRequest(RepayLoanDto requestDto, Boolean isBot) throws
		JsonProcessingException;

	void completeLoanRepayRequest(AccountTransactionPayload requestDto) throws Exception;

	void rollbackLoanWithdrawal(AccountTransactionPayload payload);

	void failLoanRepayRequest(AccountTransactionPayload accountTransactionFail);
}
