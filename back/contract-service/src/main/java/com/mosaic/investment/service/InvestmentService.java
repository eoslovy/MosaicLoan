package com.mosaic.investment.service;

import com.mosaic.investment.dto.StartInvestRequestDto;

public interface InvestmentService {
	void createInvestment(StartInvestRequestDto requestDto);
}
