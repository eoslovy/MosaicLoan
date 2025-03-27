package com.mosaic.accountservice.event.handler;

import com.mosaic.accountservice.event.model.AccountTransactionPayload;
import com.mosaic.accountservice.event.model.AccountTransactionType;

public interface TransactionEventHandler {
	boolean supports(AccountTransactionType eventType);

	void handle(AccountTransactionPayload payload);
}