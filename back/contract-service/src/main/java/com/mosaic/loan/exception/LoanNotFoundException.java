package com.mosaic.loan.exception;

public class LoanNotFoundException extends RuntimeException {
	public LoanNotFoundException(Integer loanId) {
		super("Loan not found for ID: " + loanId);
	}
}

