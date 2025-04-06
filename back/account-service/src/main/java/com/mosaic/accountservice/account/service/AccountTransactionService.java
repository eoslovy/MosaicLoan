package com.mosaic.accountservice.account.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.accountservice.account.dto.AccountTransactionSearchRequest;
import com.mosaic.accountservice.account.dto.AccountTransactionSearchResponse;
import com.mosaic.payload.AccountTransactionPayload;

public interface AccountTransactionService {
	void handleExternalDeposit(AccountTransactionPayload payload) throws JsonProcessingException;

	void handleExternalWithdrawal(AccountTransactionPayload payload) throws JsonProcessingException;

	void handleInvestmentDeposit(AccountTransactionPayload payload) throws JsonProcessingException;

	void handleInvestmentWithdrawal(AccountTransactionPayload payload) throws JsonProcessingException;

	void handleLoanDeposit(AccountTransactionPayload payload) throws JsonProcessingException;

	void handleLoanWithdrawal(AccountTransactionPayload payload) throws JsonProcessingException;

	void compensateInvestmentDepositFailure(AccountTransactionPayload payload) throws JsonProcessingException;

	void compensateInvestmentWithdrawalFailure(AccountTransactionPayload payload) throws JsonProcessingException;

	void compensateLoanDepositFailure(AccountTransactionPayload payload) throws JsonProcessingException;

	void compensateLoanWithdrawalFailure(AccountTransactionPayload payload) throws JsonProcessingException;

	AccountTransactionSearchResponse searchTransactions(AccountTransactionSearchRequest request, Integer memberId);
}
