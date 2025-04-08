package com.mosaic.investment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.core.model.Investment;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.investment.dto.WithdrawalInvestmentDto;
import com.mosaic.loan.event.message.LoanCreateTransactionPayload;
import com.mosaic.payload.AccountTransactionPayload;

public interface InvestmentService {
	void publishInvestmentRequest(RequestInvestmentDto requestDto, Integer memberId, Boolean isBot) throws
		InternalSystemException,
		JsonProcessingException;

	void completeInvestmentRequest(AccountTransactionPayload requestDto) throws Exception;

	void finishActiveInvestment(Investment investment);

	void publishInvestmentWithdrawal(WithdrawalInvestmentDto requestDto, Boolean isBot) throws JsonProcessingException;

	void rollbackInvestmentWithdrawal(AccountTransactionPayload payload);

	void searchLoanAptInvestor(LoanCreateTransactionPayload loanTransactionReq) throws Exception;
}
