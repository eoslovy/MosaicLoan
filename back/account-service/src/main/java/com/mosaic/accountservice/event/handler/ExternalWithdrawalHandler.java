package com.mosaic.accountservice.event.handler;

import org.springframework.stereotype.Component;

import com.mosaic.accountservice.domain.TransactionType;
import com.mosaic.accountservice.event.model.AccountTransactionPayload;
import com.mosaic.accountservice.event.model.AccountTransactionType;
import com.mosaic.accountservice.service.AccountTransactionService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExternalWithdrawalHandler implements TransactionEventHandler {
	private final AccountTransactionService service;

	@Override
	public boolean supports(AccountTransactionType eventType) {
		return eventType == AccountTransactionType.EXTERNAL_WITHDRAWAL_COMPLETED;
	}

	@Override
	public void handle(AccountTransactionPayload payload) {
		service.processTransaction(payload.accountId(), payload.amount(), TransactionType.EXTERNAL_OUT, "외부 출금",
			payload.targetId());
	}
}
