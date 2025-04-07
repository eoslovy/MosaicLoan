package com.mosaic.accountservice.account.domain;

public enum TransactionType {
	INVESTMENT_IN(true),
	INVESTMENT_OUT(false),
	LOAN_IN(true),
	LOAN_OUT(false),
	EXTERNAL_IN(true),
	EXTERNAL_OUT(false),
	INVESTMENT_IN_COMPENSATION(false),
	INVESTMENT_OUT_COMPENSATION(true),
	LOAN_IN_COMPENSATION(false),
	LOAN_OUT_COMPENSATION(true),
	EXTERNAL_IN_COMPENSATION(false),
	EXTERNAL_OUT_COMPENSATION(true);

	private final boolean income;

	TransactionType(boolean income) {
		this.income = income;
	}

	public boolean isIncome() {
		return income;
	}

	public boolean isCompensation() {
		return this.name().endsWith("_COMPENSATION");
	}
}