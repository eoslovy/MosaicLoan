package com.mosaic.accountservice.event.handler;

import org.springframework.stereotype.Component;

import com.mosaic.accountservice.domain.TransactionType;
import com.mosaic.accountservice.event.model.AccountTransactionPayload;
import com.mosaic.accountservice.event.model.AccountTransactionType;
import com.mosaic.accountservice.service.AccountTransactionService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExternalDepositHandler implements TransactionEventHandler {
	private final AccountTransactionService service;

	@Override
	public boolean supports(AccountTransactionType eventType) {
		return eventType == AccountTransactionType.EXTERNAL_DEPOSIT_COMPLETED;
	}

	@Override
	public void handle(AccountTransactionPayload payload) {
		service.processTransaction(payload.accountId(), payload.amount(), TransactionType.EXTERNAL_IN, "외부 입금",
			payload.targetId());
	}
}