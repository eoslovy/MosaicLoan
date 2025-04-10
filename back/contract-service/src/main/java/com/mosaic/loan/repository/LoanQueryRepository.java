package com.mosaic.loan.repository;

import com.mosaic.loan.dto.LoanOverviewResponse;
import com.mosaic.loan.dto.LoanSearchRequest;
import com.mosaic.loan.dto.LoanSearchResponse;
import com.mosaic.loan.dto.LoanTransactionsResponse;

public interface LoanQueryRepository {
	LoanSearchResponse searchLoans(LoanSearchRequest request, Integer memberId);

	LoanTransactionsResponse findContractsByLoanId(Integer loanId);

	LoanOverviewResponse getLoanOverview(Integer memberId);
} 