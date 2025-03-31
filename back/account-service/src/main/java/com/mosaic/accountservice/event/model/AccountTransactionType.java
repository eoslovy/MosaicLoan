package com.mosaic.accountservice.event.model;

import lombok.Getter;

@Getter
public enum AccountTransactionType {
	EXTERNAL_DEPOSIT_COMPLETED,
	EXTERNAL_WITHDRAWAL_COMPLETED,
}