package com.mosaic.investment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.investment.dto.ApprovedInvestmentDto;
import com.mosaic.investment.dto.RequestInvestmentDto;

public interface InvestmentService {
	void publishInvestment(RequestInvestmentDto requestDto) throws InternalSystemException, JsonProcessingException;

	void createInvestment(ApprovedInvestmentDto requestDto) throws InternalSystemException;
}
