package com.mosaic.investment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.investment.dto.RequestInvestmentDto;
import com.mosaic.payload.AccountTransactionPayload;
import com.mosaic.payload.ContractTransactionPayload;

public interface InvestmentService {
	void publishInvestmentRequest(RequestInvestmentDto requestDto) throws
		InternalSystemException,
		JsonProcessingException;

	void completeInvestmentRequest(AccountTransactionPayload requestDto) throws Exception;

	void searchLoanAptInvestor(ContractTransactionPayload loanTransactionReq) throws Exception;
}
