package com.mosaic.investment.service;

import java.time.LocalDateTime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.core.model.Investment;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.loan.event.message.LoanCreateTransactionPayload;
import com.mosaic.payload.AccountTransactionPayload;

public interface InvestmentService {
	void publishInvestmentRequest(RequestInvestmentDto requestDto, LocalDateTime now, Integer memberId,
		Boolean isBot) throws
		InternalSystemException,
		JsonProcessingException;

	void completeInvestmentRequest(AccountTransactionPayload requestDto) throws Exception;

	void executeCompleteInvestmentByDueDate(LocalDateTime now, Boolean isBot) throws JsonProcessingException;

	Boolean finishActiveInvestment(Investment investment, LocalDateTime now, Boolean isBot);

	void rollbackInvestmentWithdrawal(AccountTransactionPayload payload);

	void searchLoanAptInvestor(LoanCreateTransactionPayload loanTransactionReq) throws Exception;
}
