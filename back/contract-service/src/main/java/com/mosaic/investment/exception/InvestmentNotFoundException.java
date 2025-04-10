package com.mosaic.investment.exception;

public class InvestmentNotFoundException extends RuntimeException {
	public InvestmentNotFoundException(Integer id) {
		super("Investment not found for id: " + id);
	}
}
