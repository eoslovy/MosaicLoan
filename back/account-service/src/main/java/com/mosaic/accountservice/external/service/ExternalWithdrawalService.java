package com.mosaic.accountservice.external.service;

import java.math.BigDecimal;

import com.fasterxml.jackson.core.JsonProcessingException;

public interface ExternalWithdrawalService {
	void withdraw(BigDecimal amount, String accountNumber, String bankCode, Integer memberId) throws
		JsonProcessingException;
}
