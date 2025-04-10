package com.mosaic.loan.repository;

import com.mosaic.loan.dto.LoanOverviewResponse;
import com.mosaic.loan.dto.LoanTransactionResponse;
import com.mosaic.loan.dto.LoanTransactionSearchRequest;
import com.mosaic.loan.dto.LoanTransactionsResponse;

public interface LoanQueryRepository {
	LoanTransactionResponse searchTransactions(LoanTransactionSearchRequest request, Integer memberId);

	LoanTransactionsResponse findContractsByLoanId(Integer loanId);

	LoanOverviewResponse getLoanOverview(Integer memberId);
} 