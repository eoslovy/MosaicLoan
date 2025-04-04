package com.mosaic.accountservice.account.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.payload.AccountTransactionPayload;

public interface AccountTransactionService {
	void handleExternalDeposit(AccountTransactionPayload payload) throws JsonProcessingException;

	void handleExternalWithdrawal(AccountTransactionPayload payload) throws JsonProcessingException;

	void handleInvestmentDeposit(AccountTransactionPayload payload) throws JsonProcessingException;

	void handleInvestmentWithdrawal(AccountTransactionPayload payload) throws JsonProcessingException;
}
