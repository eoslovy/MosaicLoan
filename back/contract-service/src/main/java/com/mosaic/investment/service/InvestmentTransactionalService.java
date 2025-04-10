package com.mosaic.investment.service;

import java.time.LocalDateTime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mosaic.investment.dto.WithdrawalInvestmentDto;

import jakarta.transaction.Transactional;

public interface InvestmentTransactionalService {

	@Transactional
	void publishInvestmentWithdrawal(WithdrawalInvestmentDto requestDto, LocalDateTime now, Boolean isBot) throws
		JsonProcessingException;
}
