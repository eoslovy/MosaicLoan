package com.mosaic.investment.service;

import com.mosaic.core.exception.InternalSystemException;
import com.mosaic.investment.dto.StartInvestRequestDto;

public interface InvestmentService {
	void publishInvestment(StartInvestRequestDto requestDto) throws InternalSystemException;

	void createInvestment(StartInvestRequestDto requestDto) throws InternalSystemException;
}
